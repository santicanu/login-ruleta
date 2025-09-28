from sqlalchemy import Column, Integer, String, Boolean, ARRAY
from database import Base

class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    firstName = Column(String, index=True)
    lastName = Column(String, index=True)
    dni = Column(String, unique=True, index=True)
    age = Column(String)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    answer1 = Column(Boolean)
    answer2 = Column(Boolean)
    answer3 = Column(String)
    answer4 = Column(ARRAY(String))
    prize_won = Column(String, nullable=True)