from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from fastapi.responses import JSONResponse

from participant import repository as participant_repo, schema as participant_schema
from prizes import repository as prizes_repo, schema as prizes_schema
from database import SessionLocal

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/participants/", response_model=participant_schema.Participant)
def create_participant(participant_frontend: participant_schema.ParticipantFrontend, db: Session = Depends(get_db)):

    # Combine area code and phone into a single string
    full_phone = f"{participant_frontend.areaCode}{participant_frontend.phone}"

    # Create a dictionary from the frontend data, excluding the separate phone fields
    participant_data = participant_frontend.model_dump(exclude={"areaCode", "phone"})
    
    # Add the combined phone number to the dictionary
    participant_data["phone"] = full_phone

    # Create the backend-compatible Pydantic model
    participant_to_create = participant_schema.ParticipantCreate(**participant_data)

    # Check if the participant already exists
    db_participant = participant_repo.get_participant_by_email(db, email=participant_to_create.email)
    if db_participant:
        return JSONResponse(
            status_code=200, 
            content={"success": False, "message": "Email already registered"}
        )
    
    # Create the participant in the database
    return participant_repo.create_participant(db=db, participant=participant_to_create)

@router.get("/participants/", response_model=List[participant_schema.Participant])
def read_participants(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    participants = participant_repo.get_participants(db, skip=skip, limit=limit)
    return participants

@router.get("/participants/{participant_id}", response_model=participant_schema.Participant)
def read_participant(participant_id: int, db: Session = Depends(get_db)):
    db_participant = participant_repo.get_participant(db, participant_id=participant_id)
    if db_participant is None:
        raise HTTPException(status_code=404, detail="Participant not found")
    return db_participant

class PrizeWonUpdate(BaseModel):
    id: int        # ID del premio
    name: str      # Nombre del premio

@router.put("/participants/{participant_id}/updatePrize", response_model=participant_schema.Participant)
def update_prize(
    participant_id: int,
    prize_data: PrizeWonUpdate,
    db: Session = Depends(get_db)
):
    # 1️⃣ Buscamos al participante
    participant = participant_repo.get_participant(db, participant_id=participant_id)
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    
    # 2️⃣ Actualizamos el premio ganado
    participant.prize_won = prize_data.name

    # 3️⃣ Buscamos el premio y sumamos una ocurrencia
    prize = prizes_repo.get_prize(db, prize_id=prize_data.id)
    if not prize:
        raise HTTPException(status_code=404, detail="Prize not found")
    
    # Validamos que no se pase del máximo
    if prize.maxOcurrency is None or prize.ocurrency < prize.maxOcurrency:
        prize.ocurrency = (prize.ocurrency or 0) + 1

    # 4️⃣ Guardamos cambios
    db.commit()
    db.refresh(participant)
    db.refresh(prize)

    return participant
