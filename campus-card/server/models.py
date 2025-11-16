from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Numeric,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from db import Base


class School(Base):
    __tablename__ = "schools"

    id = Column(Integer, primary_key=True)
    school_name = Column(String)


class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(Integer, primary_key=True)
    balance = Column(Numeric)
    credit_limit = Column(Numeric)
    credit_score = Column(Integer)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True)
    address = Column(Text)
    phone_number = Column(String)

    school_id = Column(Integer, ForeignKey("schools.id"))
    wallet_id = Column(Integer, ForeignKey("wallets.id"))

    school = relationship("School")
    wallet = relationship("Wallet")

    friend_id = Column(Integer, ForeignKey("users.id"), nullable=True)

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    wallet_id = Column(Integer, ForeignKey("wallets.id"))
    merchant = Column(String)
    category = Column(String)
    amount = Column(Numeric)
    location = Column(String)
    date = Column(DateTime)

    user = relationship("User")
    wallet = relationship("Wallet")

class SecurityQuestion(Base):
    __tablename__ = "security_questions"

    id = Column(Integer, primary_key=True)
    question = Column(Text)


class UserProfile(Base):
    __tablename__ = "user_profiles"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    major = Column(String)
    class_year = Column(Integer)
    residence_type = Column(String)
    interests = Column(String)

    user = relationship("User", backref="profile")


class UserSecurityAnswer(Base):
    __tablename__ = "user_security_answers"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("security_questions.id"), nullable=False)
    answer = Column(Text)

    user = relationship("User")
    question = relationship("SecurityQuestion")


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    category = Column(String)
    is_volunteering = Column(Integer)
    location = Column(String)
    start_time = Column(DateTime)
    cost = Column(Numeric)
    volunteering_hours = Column(Integer)
