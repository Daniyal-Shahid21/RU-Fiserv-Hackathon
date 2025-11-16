# reset_db.py
import os
from sqlalchemy import create_engine
from dotenv import load_dotenv
import models

load_dotenv()
engine = create_engine(os.environ["DATABASE_URL"])
Base = models.Base

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
