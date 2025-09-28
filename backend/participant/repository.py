from sqlalchemy.orm import Session
from participant import model, schema

def get_participant(db: Session, participant_id: int):
    return db.query(model.Participant).filter(model.Participant.id == participant_id).first()

def get_participant_by_email(db: Session, email: str):
    return db.query(model.Participant).filter(model.Participant.email == email).first()

def get_participants(db: Session, skip: int = 0, limit: int = 100):
    return db.query(model.Participant).offset(skip).limit(limit).all()

def create_participant(db: Session, participant: schema.ParticipantCreate):
    db_participant = model.Participant(**participant.dict())
    db.add(db_participant)
    db.commit()
    db.refresh(db_participant)
    return db_participant
