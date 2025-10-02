import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from participant.router import router as participant_router
from prizes.router import router as prize_router

# Import database objects and the models
from database import engine, Base
from participant import model as participant_model
from prizes import model as prize_model

# Create the database tables if they don't exist
print("Creating database tables if they don't exist...")
Base.metadata.create_all(bind=engine)
print("Tables created.")

app = FastAPI()

# --- CORS Middleware Configuration ---
# Lista de orígenes permitidos (tu frontend en Vercel y el entorno local)
origins = [
    "https://<TU_FRONTEND_URL>.vercel.app",  # Reemplaza con la URL de tu app en Vercel
    "http://localhost:5173",  # Puerto por defecto de Vite para desarrollo
    "http://localhost:3000",  # Puerto común para desarrollo de React
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(participant_router, prefix="/api", tags=["participants"])
app.include_router(prize_router, prefix="/api", tags=["prizes"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Roulette API"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

