from datetime import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, Float, TIMESTAMP, DateTime
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)


class FuelDataDB(Base):
    __tablename__ = "fuel_data"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))  # Assuming 'users' table exists
    fuel_type = Column(String, index=True)
    amount = Column(Float)
    tax_rate = Column(Float)
    total = Column(Float)
    created_at = Column(DateTime, default=datetime.now())

    user = relationship("User")  # Define relationship with User table if needed
