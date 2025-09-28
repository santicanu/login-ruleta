from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from prizes import repository, schema
from database import SessionLocal

# Se añade un prefijo y tags para agrupar los endpoints en la documentación
router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/prizes/", response_model=schema.Prize)
def create_prize(prize: schema.PrizeCreate, db: Session = Depends(get_db)):
    return repository.create_prize(db=db, prize=prize)

@router.get("/prizes/", response_model=list[schema.Prize])
def read_prizes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    prizes = repository.get_prizes(db, skip=skip, limit=limit)
    return prizes

@router.get("/prizes/{prize_id}", response_model=schema.Prize)
def read_prize(prize_id: int, db: Session = Depends(get_db)):
    db_prize = repository.get_prize(db, prize_id=prize_id)
    if db_prize is None:
        raise HTTPException(status_code=404, detail="Prize not found")
    return db_prize

@router.put("/{prize_id}/max-ocurrency", response_model=schema.Prize)
def update_prize_max_ocurrency(prize_id: int, prize_update: schema.PrizeUpdateMaxOcurrency, db: Session = Depends(get_db)):
    db_prize = repository.update_max_ocurrency(db, prize_id=prize_id, max_ocurrency=prize_update.maxOcurrency)
    if db_prize is None:
        raise HTTPException(status_code=404, detail="Prize not found")
    return db_prize

@router.put("/{prize_id}/reset-ocurrency", response_model=schema.Prize)
def reset_prize_ocurrency(prize_id: int, db: Session = Depends(get_db)):
    db_prize = repository.reset_ocurrency(db, prize_id=prize_id)
    if db_prize is None:
        raise HTTPException(status_code=404, detail="Prize not found")
    return db_prize
