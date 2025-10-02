from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.exc import OperationalError
import time

# --- Database Configuration ---
DB_USER = "miksa_user"
DB_PASSWORD = "ruleta"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "ruleta_db"

# Connection URL for the default 'postgres' database
DEFAULT_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/postgres"

# Connection URL for your specific application database
SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

def create_database_if_not_exists():
    """
    Connects to the default 'postgres' database, checks if the target database
    exists, and creates it if it does not.
    """
    try:
        # Connect to the default database to perform admin tasks
        engine = create_engine(DEFAULT_DATABASE_URL, isolation_level="AUTOCOMMIT")
        with engine.connect() as connection:
            # Check if the database exists
            result = connection.execute(text(f"SELECT 1 FROM pg_database WHERE datname = '{DB_NAME}'"))
            if result.scalar() != 1:
                print(f"Database '{DB_NAME}' not found. Creating it...")
                connection.execute(text(f"CREATE DATABASE {DB_NAME}"))
                print(f"Database '{DB_NAME}' created successfully.")
            else:
                print(f"Database '{DB_NAME}' already exists.")
    except OperationalError as e:
        print(f"Error connecting to PostgreSQL server: {e}")
        print("Please ensure PostgreSQL is running and the connection details are correct.")
        # Give it a moment before the app tries to connect again
        time.sleep(5)
        raise

# --- App-level SQLAlchemy objects ---
# Run the check and creation logic on startup
create_database_if_not_exists()

# Now, create the engine for the application to use, connecting to the specific DB
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()