import os

from fastapi import APIRouter, HTTPException, Response
from jose import jwt
from passlib.context import CryptContext
from pydantic import BaseModel


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH", "")
AUTH_SECRET_KEY = os.getenv("AUTH_SECRET_KEY", "")

AUTH_COOKIE_SECURE = (
    os.getenv("AUTH_COOKIE_SECURE", "false").lower() == "true"
)


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(
    credentials: LoginRequest,
    response: Response,
):
    # Check username
    if credentials.username != ADMIN_USERNAME:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    # Make sure password hash exists
    if not ADMIN_PASSWORD_HASH:
        raise HTTPException(
            status_code=500,
            detail="Admin password is not configured",
        )

    # Check password
    try:
        password_valid = pwd_context.verify(
            credentials.password,
            ADMIN_PASSWORD_HASH,
        )
    except Exception:
        password_valid = False

    if not password_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    # Make sure secret exists
    if not AUTH_SECRET_KEY:
        raise HTTPException(
            status_code=500,
            detail="Authentication secret is not configured",
        )

    # Create JWT token
    token = jwt.encode(
        {
            "sub": credentials.username,
            "role": "admin",
        },
        AUTH_SECRET_KEY,
        algorithm="HS256",
    )

    # Store token in secure HTTP-only cookie
    response.set_cookie(
        key="tara_admin_token",
        value=token,
        httponly=True,
        secure=AUTH_COOKIE_SECURE,
        samesite="lax",
        max_age=8 * 60 * 60,
        path="/",
    )

    return {
        "message": "Login successful",
        "username": credentials.username,
    }

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="tara_admin_token",
        path="/",
    )

    return {
        "message": "Logged out successfully"
    }