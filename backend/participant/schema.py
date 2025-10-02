from pydantic import BaseModel, Field
from typing import List, Optional

# This is the base model that matches the database table
class ParticipantBase(BaseModel):
    firstName: str
    lastName: str
    age: str
    email: str
    phone: str # The combined phone number
    answer1: bool
    answer2: bool
    answer3: str
    answer4: List[str]
    prize_won: str

class ParticipantCreate(ParticipantBase):
    pass

class Participant(ParticipantBase):
    id: int

    class Config:
        from_attributes = True

# New schema for incoming data from the frontend
class ParticipantFrontend(BaseModel):
    firstName: str
    lastName: str
    age: str
    email: str
    areaCode: str # from frontend
    phone: str    # from frontend
    answer1: bool
    answer2: bool
    answer3: str
    answer4: List[str]
    prize_won: str