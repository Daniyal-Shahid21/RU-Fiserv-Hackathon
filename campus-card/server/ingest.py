# ingest.py

import os
from datetime import datetime
from decimal import Decimal

import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

import models  # your models.py


# ---------------------------------------------------------------------------
# DB setup
# ---------------------------------------------------------------------------

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set in your environment (.env).")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base was imported inside models.py from db.py
Base = models.Base


# ---------------------------------------------------------------------------
# Optional: wipe and recreate all tables defined in models.py
# ---------------------------------------------------------------------------

def reset_database():
    """
    DANGER: drops ALL tables mapped to Base, then recreates them.
    Call this only if you want a completely fresh schema + data.
    """
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


# ---------------------------------------------------------------------------
# CSV helpers
# ---------------------------------------------------------------------------

DATA_DIR = os.path.dirname(os.path.abspath(__file__))


def csv_path(filename: str) -> str:
    return os.path.join(DATA_DIR, filename)


def load_csv(filename: str) -> pd.DataFrame:
    path = csv_path(filename)
    if not os.path.exists(path):
        raise FileNotFoundError(f"CSV not found: {path}")
    return pd.read_csv(path)


# ---------------------------------------------------------------------------
# Loaders per table
# ---------------------------------------------------------------------------

def load_schools(session):
    df = load_csv("schools.csv")
    for _, row in df.iterrows():
        obj = models.School(
            id=int(row["id"]),
            school_name=row["school name"],
        )
        session.merge(obj)


def load_wallets(session):
    df = load_csv("wallets.csv")
    for _, row in df.iterrows():
        obj = models.Wallet(
            id=int(row["id"]),
            balance=Decimal(str(row["balance"])),
            credit_limit=Decimal(str(row["credit_limit"])),
            credit_score=int(row["credit_score"]),
        )
        session.merge(obj)


def load_security_questions(session):
    df = load_csv("security_questions.csv")
    for _, row in df.iterrows():
        obj = models.SecurityQuestion(
            id=int(row["id"]),
            question=row["question"],
        )
        session.merge(obj)


def load_events(session):
    df = load_csv("events.csv")
    for _, row in df.iterrows():
        # CSV format example: "11/5/2025 17:00"
        start_time = datetime.strptime(row["start_time"], "%m/%d/%Y %H:%M")

        obj = models.Event(
            id=int(row["event_id"]),
            name=row["name"],
            category=row["category"],
            is_volunteering=int(row["is_volunteering"]),
            location=row["location"],
            start_time=start_time,
            cost=Decimal(str(row["cost"])),
            volunteering_hours=int(row["volunteering_hours"]),
        )
        session.merge(obj)


def load_users(session):
    df = load_csv("users.csv")
    for _, row in df.iterrows():
        friend_id = None
        if not pd.isna(row["friend_id"]):
            friend_id = int(row["friend_id"])

        user = models.User(
            name=row["name"],
            email=row["email"],
            address=row["address"],
            phone_number=row["phone_number"],
            school_id=int(row["school_id"]),
            wallet_id=int(row["wallet_id"]),
            friend_id=friend_id,
        )
        session.add(user)

def load_user_profiles(session):
    df = load_csv("user_profiles.csv")
    for _, row in df.iterrows():
        obj = models.UserProfile(
            user_id=int(row["user_id"]),
            major=row["major"],
            class_year=int(row["class_year"]),
            residence_type=row["residence_type"],
            interests=row["interests"],
        )
        session.merge(obj)


def load_transactions(session):
    df = load_csv("transaction.csv")
    for _, row in df.iterrows():
        obj = models.Transaction(
            id=int(row["id"]),
            user_id=int(row["user_id"]),
            wallet_id=int(row["wallet_id"]),
            merchant=row["merchant"],
            category=row["category"],
            amount=Decimal(str(row["amount"])),
            location=row["location"],
            # CSV example: "2024-09-07 13:06:41"
            date=datetime.fromisoformat(row["date"]),
        )
        session.merge(obj)


def load_user_security_answers(session):
    df = load_csv("user_security_answers.csv")
    for _, row in df.iterrows():
        obj = models.UserSecurityAnswer(
            id=int(row["id"]),
            user_id=int(row["user_id"]),
            question_id=int(row["question_id"]),
            answer=row["answer"],
        )
        session.merge(obj)


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def main():
    # WARNING:
    # Uncomment this if you really want to nuke all existing tables/data
    # (for all models defined in models.py) and start fresh.
    #
    reset_database()

    session = SessionLocal()
    try:
        # Load independent tables first
        load_schools(session)
        load_wallets(session)
        load_security_questions(session)
        load_events(session)

        # Then tables that depend on those (via FKs)
        load_users(session)
        load_user_profiles(session)
        load_transactions(session)
        load_user_security_answers(session)

        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


if __name__ == "__main__":
    main()
