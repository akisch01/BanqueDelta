from pydantic import BaseModel
from datetime import date

# Schémas pour les utilisateurs
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int


    class Config:
        orm_mode = True


# Schémas pour les clients
class ClientBase(BaseModel):
    nom: str
    prenom: str
    date_naissance: date
    adresse: str

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: int

    class Config:
        orm_mode = True

# Schémas pour les comptes
class CompteBase(BaseModel):
    client_id: int
    type_compte: str
    solde: float
    taux_interet: float = None
    decouvert_autorise: float = None

class CompteCreate(CompteBase):
    pass

class Compte(CompteBase):
    id: int

    class Config:
        orm_mode = True

# Schémas pour les transactions
class TransactionBase(BaseModel):
    compte_id: int
    type_transaction: str
    montant: float

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    date_transaction: date

    class Config:
        orm_mode = True

# Schémas pour l'authentification
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str = None

# chémas pour les opérations
class OperationBase(BaseModel):
    montant: float

class DepotCreate(OperationBase):
    pass

class RetraitCreate(OperationBase):
    pass

class InteretCreate(BaseModel):
    pass  # Vide car le calcul d'intérêt ne prend pas de paramètres