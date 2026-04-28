from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.auth.utils import hash_password, verify_password, create_access_token

router = APIRouter()

users_db = []

# ✅ MODEL
class UserAuth(BaseModel):
    email: EmailStr
    password: str


# ✅ SIGNUP
@router.post("/signup")
def signup(user: UserAuth):

    for u in users_db:
        if u["email"] == user.email:
            raise HTTPException(status_code=400, detail="User already exists")

    hashed = hash_password(user.password)

    users_db.append({
        "email": user.email,
        "password": hashed
    })

    return {"message": "User created successfully"}


# ✅ LOGIN
@router.post("/login")
def login(user: UserAuth):

    for u in users_db:
        if u["email"] == user.email:

            if not verify_password(user.password, u["password"]):
                raise HTTPException(status_code=401, detail="Invalid password")

            token = create_access_token({"sub": user.email})

            return {
                "access_token": token,
                "token_type": "bearer"
            }

    raise HTTPException(status_code=404, detail="User not found")
