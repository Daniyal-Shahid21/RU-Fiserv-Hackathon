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


class Bank(Base):
    __tablename__ = "banks"

    id = Column(Integer, primary_key=True)
    bank_name = Column(String)


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
    bank_id = Column(Integer, ForeignKey("banks.id"))
    wallet_id = Column(Integer, ForeignKey("wallets.id"))

    school = relationship("School")
    bank = relationship("Bank")
    wallet = relationship("Wallet")


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
