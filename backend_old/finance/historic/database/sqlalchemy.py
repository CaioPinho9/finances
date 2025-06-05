import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Connection string pode ser alterada para outro banco (ex: 'postgresql://user:pass@localhost/dbname')
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "../../sqlite/db/finance.db")

DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, echo=True, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
