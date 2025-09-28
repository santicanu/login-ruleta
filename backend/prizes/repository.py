from sqlalchemy.orm import Session
from prizes import model, schema

def _recalculate_probabilities(db: Session):
    """Recalcula la probabilidad de todos los premios."""
    prizes = db.query(model.Prize).all()
    if not prizes:
        return

    total_max_ocurrency = sum(prize.maxOcurrency for prize in prizes if prize.maxOcurrency > 0)

    if total_max_ocurrency == 0:
        # Evitar división por cero. Asignar probabilidad equitativa si no hay stock.
        prob = 1 / len(prizes) if prizes else 0
        for prize in prizes:
            prize.probability = prob
    else:
        for prize in prizes:
            prize.probability = prize.maxOcurrency / total_max_ocurrency
    
    db.commit()

def get_prize(db: Session, prize_id: int):
    return db.query(model.Prize).filter(model.Prize.id == prize_id).first()

def get_prizes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(model.Prize).offset(skip).limit(limit).all()

def create_prize(db: Session, prize: schema.PrizeCreate):
    db_prize = model.Prize(
        name=prize.name,
        maxOcurrency=prize.maxOcurrency,
        ocurrency=0,  # Ocurrency siempre inicia en 0
        probability=0  # Se calculará después
    )
    db.add(db_prize)
    db.commit()
    db.refresh(db_prize)

    _recalculate_probabilities(db)  # Recalcular todas las probabilidades

    db.refresh(db_prize)  # Refrescar para obtener la nueva probabilidad
    return db_prize

def update_max_ocurrency(db: Session, prize_id: int, max_ocurrency: int):
    db_prize = get_prize(db, prize_id)
    if db_prize:
        db_prize.maxOcurrency = max_ocurrency
        db.commit()
        db.refresh(db_prize)
        _recalculate_probabilities(db)  # Recalcular probabilidades tras el cambio
        db.refresh(db_prize)
    return db_prize

def reset_ocurrency(db: Session, prize_id: int):
    db_prize = get_prize(db, prize_id)
    if db_prize:
        db_prize.ocurrency = 0
        db.commit()
        db.refresh(db_prize)
    return db_prize
