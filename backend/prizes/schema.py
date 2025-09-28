from pydantic import BaseModel

# Esquema para la entrada de actualización de maxOcurrency
class PrizeUpdateMaxOcurrency(BaseModel):
    maxOcurrency: int

# Esquema para la entrada de creación de un premio
class PrizeCreate(BaseModel):
    name: str
    maxOcurrency: int

# Esquema base para la respuesta, que contiene todos los campos
class PrizeBase(BaseModel):
    id: int
    name: str
    ocurrency: int
    maxOcurrency: int
    probability: float

# Modelo de respuesta completo
class Prize(PrizeBase):
    class Config:
        from_attributes = True  # Reemplaza a orm_mode en Pydantic v2
