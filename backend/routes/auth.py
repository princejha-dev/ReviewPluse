from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
import bcrypt
from ..db.database import SessionLocal
from ..db import crud

router = APIRouter(prefix="/auth", tags=["auth"])

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = "customer"

class LoginRequest(BaseModel):
    email: str
    password: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    # bcrypt returns bytes, so we decode it for storage in DB
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

@router.post("/signup")
async def signup(req: SignupRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, req.email)
    if user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    hashed_password = get_password_hash(req.password)
    new_user = crud.create_user(db, req.name, req.email, hashed_password, req.role)
    
    return {"message": "User created successfully", "id": new_user.id, "email": new_user.email}

@router.post("/login")
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, req.email)
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    return {
        "message": "Login successful",
        "name": user.name,
        "email": user.email,
        "role": user.role
    }
