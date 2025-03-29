from datetime import datetime
from sqlalchemy.orm import Session
import models
import schemas
from auth import get_password_hash

# Utilisateurs
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

# Modifiez la fonction create_user
def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        hashed_password=hashed_password,
        nom=user.nom,
        prenom=user.prenom
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Clients
def create_client(db: Session, client: schemas.ClientCreate):
    db_client = models.Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

def get_client(db: Session, client_id: int):
    return db.query(models.Client).filter(models.Client.id == client_id).first()

def get_clients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Client).offset(skip).limit(limit).all()

def update_client(db: Session, client_id: int, client: schemas.ClientCreate):
    db_client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if db_client:
        for key, value in client.dict().items():
            setattr(db_client, key, value)
        db.commit()
        db.refresh(db_client)
    return db_client

def delete_client(db: Session, client_id: int):
    db_client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if db_client:
        db.delete(db_client)
        db.commit()
    return db_client

# Comptes
def create_compte(db: Session, compte: schemas.CompteCreate):
    db_compte = models.Compte(**compte.dict())
    db.add(db_compte)
    db.commit()
    db.refresh(db_compte)
    return db_compte

def get_compte(db: Session, compte_id: int):
    return db.query(models.Compte).filter(models.Compte.id == compte_id).first()

def get_comptes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Compte).offset(skip).limit(limit).all()

def update_compte(db: Session, compte_id: int, compte: schemas.CompteCreate):
    db_compte = db.query(models.Compte).filter(models.Compte.id == compte_id).first()
    if db_compte:
        for key, value in compte.dict().items():
            setattr(db_compte, key, value)
        db.commit()
        db.refresh(db_compte)
    return db_compte

def delete_compte(db: Session, compte_id: int):
    db_compte = db.query(models.Compte).filter(models.Compte.id == compte_id).first()
    if db_compte:
        db.delete(db_compte)
        db.commit()
    return db_compte

# Transactions
def create_transaction(db: Session, transaction: schemas.TransactionCreate):
    db_transaction = models.Transaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def get_transactions_by_compte(db: Session, compte_id: int):
    return db.query(models.Transaction).filter(models.Transaction.compte_id == compte_id).all()

def get_transactions_by_compte(db: Session, compte_id: int):
    return db.query(models.Transaction)\
           .filter(models.Transaction.compte_id == compte_id)\
           .order_by(models.Transaction.date_transaction.desc())\
           .all()

# Logique métier
def deposer_argent(db: Session, compte_id: int, montant: float):
    compte = get_compte(db, compte_id)
    if not compte:
        raise ValueError("Compte non trouvé")
    
    # Enregistrez la transaction
    db_transaction = models.Transaction(
        compte_id=compte_id,
        type_transaction="dépôt",
        montant=montant,
        date_transaction=datetime.now()
    )
    db.add(db_transaction)
    
    compte.solde += montant
    db.commit()
    db.refresh(compte)
    return compte

def retirer_argent(db: Session, compte_id: int, montant: float):
    compte = get_compte(db, compte_id)
    if not compte:
        raise ValueError("Compte non trouvé")
    
    # Créez la transaction AVANT de modifier le solde
    db_transaction = models.Transaction(
        compte_id=compte_id,
        type_transaction="retrait",
        montant=montant,
        date_transaction=datetime.now()
    )
    db.add(db_transaction)
    
    # Logique de retrait existante
    if compte.type_compte == "courant" and compte.solde - montant < -compte.decouvert_autorise:
        raise ValueError("Découvert autorisé dépassé")
    
    compte.solde -= montant
    db.commit()  # Important : commit après les modifications
    db.refresh(compte)
    return compte

def calculer_interets(db: Session, compte_id: int):
    compte = get_compte(db, compte_id)
    if not compte or compte.type_compte != "épargne":
        raise ValueError("Compte épargne non trouvé")
    interets = compte.solde * compte.taux_interet / 100
    compte.solde += interets
    db.commit()
    db.refresh(compte)
    return compte