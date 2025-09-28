from sqlalchemy import Column, Integer, String, Float
from database import Base

class Prize(Base):
    __tablename__ = 'prizes'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    ocurrency = Column(Integer)
    maxOcurrency = Column(Integer)
    probability = Column(Float)
