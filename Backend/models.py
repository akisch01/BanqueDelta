from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String, Float, Date, ForeignKey, Enum
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, index=True)
    prenom = Column(String, index=True)
    date_naissance = Column(Date)
    adresse = Column(String)

class Compte(Base):
    __tablename__ = "comptes"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    type_compte = Column(Enum("courant", "épargne", name="type_compte"))
    solde = Column(Float)
    taux_interet = Column(Float, nullable=True)  # Uniquement pour le compte épargne
    decouvert_autorise = Column(Float, nullable=True)  # Uniquement pour le compte courant

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    compte_id = Column(Integer, ForeignKey("comptes.id", ondelete="CASCADE"))
    type_transaction = Column(Enum("dépôt", "retrait", name="type_transaction"))
    montant = Column(Float)
    date_transaction = Column(DateTime, default=datetime.now)