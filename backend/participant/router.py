from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from participant import repository, schema
from database import SessionLocal

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/participants/", response_model=schema.Participant)
def create_participant(participant_frontend: schema.ParticipantFrontend, db: Session = Depends(get_db)):
    
    # Combine area code and phone into a single string
    full_phone = f"{participant_frontend.areaCode}{participant_frontend.phone}"

    # Create a dictionary from the frontend data, excluding the separate phone fields
    participant_data = participant_frontend.model_dump(exclude={"areaCode", "phone"})
    
    # Add the combined phone number to the dictionary
    participant_data["phone"] = full_phone

    # Create the backend-compatible Pydantic model
    participant_to_create = schema.ParticipantCreate(**participant_data)

    # Check if the participant already exists
    db_participant = repository.get_participant_by_email(db, email=participant_to_create.email)
    if db_participant:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create the participant in the database
    return repository.create_participant(db=db, participant=participant_to_create)

@router.get("/participants/", response_model=List[schema.Participant])
def read_participants(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    participants = repository.get_participants(db, skip=skip, limit=limit)
    return participants

@router.get("/participants/{participant_id}", response_model=schema.Participant)
def read_participant(participant_id: int, db: Session = Depends(get_db)):
    db_participant = repository.get_participant(db, participant_id=participant_id)
    if db_participant is None:
        raise HTTPException(status_code=404, detail="Participant not found")
    return db_participant
