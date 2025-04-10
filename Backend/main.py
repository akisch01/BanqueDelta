from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
import models
import schemas
from typing import List
from datetime import datetime
from fastapi import Body
from typing import Optional
import crud
from auth import create_access_token, get_password_hash, verify_password, decode_token
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://192.168.16.102:3000",
    "http://192.168.16.102:8000",  # Ajoutez aussi le backend si nécessaire
]
# Configuration du  CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependence
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Authentification
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token invalide")
    username = payload.get("sub")
    user = crud.get_user_by_username(db, username=username)
    if not user:
        raise HTTPException(status_code=401, detail="Utilisateur non trouvé")
    return user


# Endpoints pour l'authentification
@app.post("/register/", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username déjà utilisé")
    
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Endpoint pour récupérer l'utilisateur courant
@app.get("/users/me", response_model=schemas.User)
async def read_current_user(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.post("/login/", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nom d'utilisateur ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": user.username}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/logout/")
def logout():
    return {"message": "Déconnexion réussie"}

# Clients
@app.post("/clients/", response_model=schemas.Client)
def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db)):
    return crud.create_client(db=db, client=client)

@app.get("/clients/", response_model=List[schemas.Client]) 
def read_clients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    clients = crud.get_clients(db, skip=skip, limit=limit)
    return clients

@app.get("/clients/{client_id}", response_model=schemas.Client)
def read_client(client_id: int, db: Session = Depends(get_db)):
    db_client = crud.get_client(db, client_id=client_id)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client non trouvé")
    return db_client

@app.put("/clients/{client_id}", response_model=schemas.Client)
def update_client(client_id: int, client: schemas.ClientCreate, db: Session = Depends(get_db)):
    db_client = crud.update_client(db, client_id=client_id, client=client)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client non trouvé")
    return db_client

@app.delete("/clients/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    db_client = crud.delete_client(db, client_id=client_id)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client non trouvé")
    return {"message": "Client supprimé"}

# Comptes
@app.post("/comptes/", response_model=schemas.Compte)
def create_compte(compte: schemas.CompteCreate, db: Session = Depends(get_db)):
    return crud.create_compte(db=db, compte=compte)

@app.get("/comptes/", response_model=List[schemas.Compte])
def read_comptes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    comptes = crud.get_comptes(db, skip=skip, limit=limit)
    return comptes

@app.get("/comptes/{compte_id}", response_model=schemas.Compte)
def read_compte(compte_id: int, db: Session = Depends(get_db)):
    db_compte = crud.get_compte(db, compte_id=compte_id)
    if db_compte is None:
        raise HTTPException(status_code=404, detail="Compte non trouvé")
    return db_compte

@app.put("/comptes/{compte_id}", response_model=schemas.Compte)
def update_compte(compte_id: int, compte: schemas.CompteCreate, db: Session = Depends(get_db)):
    db_compte = crud.update_compte(db, compte_id=compte_id, compte=compte)
    if db_compte is None:
        raise HTTPException(status_code=404, detail="Compte non trouvé")
    return db_compte

@app.delete("/comptes/{compte_id}")
def delete_compte(compte_id: int, db: Session = Depends(get_db)):
    db_compte = crud.delete_compte(db, compte_id=compte_id)
    if db_compte is None:
        raise HTTPException(status_code=404, detail="Compte non trouvé")
    return {"message": "Compte supprimé"}

@app.post("/comptes/{compte_id}/depot", response_model=schemas.Compte)
def deposer_argent(
    compte_id: int,
    depot: schemas.DepotCreate = Body(...),  # Spécifiez le schéma
    db: Session = Depends(get_db)
):
    return crud.deposer_argent(db, compte_id=compte_id, montant=depot.montant)

@app.post("/comptes/{compte_id}/retrait", response_model=schemas.Compte)
def retirer_argent(
    compte_id: int,
    retrait: schemas.RetraitCreate = Body(...),
    db: Session = Depends(get_db)
):
    return crud.retirer_argent(db, compte_id=compte_id, montant=retrait.montant)

# Transactions
@app.get("/comptes/{compte_id}/transactions")
def get_transactions(compte_id: int, db: Session = Depends(get_db)):
    transactions = crud.get_transactions_by_compte(db, compte_id=compte_id)
    return transactions

# Calcul des intérêts
@app.post("/comptes/{compte_id}/calcul-interets")
def calculer_interets(compte_id: int, db: Session = Depends(get_db)):
    try:
        compte = crud.calculer_interets(db, compte_id=compte_id)
        return {"message": "Intérêts calculés", "nouveau_solde": compte.solde}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)