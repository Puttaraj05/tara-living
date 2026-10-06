import os
from datetime import datetime, timedelta, timezone

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


ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH")
AUTH_SECRET_KEY = os.getenv("AUTH_SECRET_KEY")

APP_ENV = os.getenv("APP_ENV", "development").lower()

AUTH_COOKIE_SECURE = (
    os.getenv(
        "AUTH_COOKIE_SECURE",
        "true" if APP_ENV == "production" else "false",
    ).lower()
    == "true"
)

JWT_EXPIRE_HOURS = 8


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(
    credentials: LoginRequest,
    response: Response,
):
    if not ADMIN_USERNAME:
        raise HTTPException(
            status_code=500,
            detail="Admin username is not configured",
        )

    if not ADMIN_PASSWORD_HASH:
        raise HTTPException(
            status_code=500,
            detail="Admin password is not configured",
        )

    if not AUTH_SECRET_KEY:
        raise HTTPException(
            status_code=500,
            detail="Authentication secret is not configured",
        )

    if credentials.username != ADMIN_USERNAME:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

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

    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(hours=JWT_EXPIRE_HOURS)

    token = jwt.encode(
        {
            "sub": credentials.username,
            "role": "admin",
            "iat": now,
            "exp": expires_at,
        },
        AUTH_SECRET_KEY,
        algorithm="HS256",
    )

    response.set_cookie(
        key="tara_admin_token",
        value=token,
        httponly=True,
        secure=AUTH_COOKIE_SECURE,
        samesite="none" if APP_ENV == "production" else "lax",
        max_age=JWT_EXPIRE_HOURS * 60 * 60,
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
        httponly=True,
        secure=AUTH_COOKIE_SECURE,
        samesite="none" if APP_ENV == "production" else "lax",
        path="/",
    )

    return {
        "message": "Logged out successfully",
    }