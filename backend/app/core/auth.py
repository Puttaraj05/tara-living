import os
from typing import Optional

from fastapi import Cookie, HTTPException
from jose import JWTError, jwt


AUTH_SECRET_KEY = os.getenv("AUTH_SECRET_KEY", "")

ALGORITHM = "HS256"


def require_admin(
    tara_admin_token: Optional[str] = Cookie(default=None),
):
    if not tara_admin_token:
        raise HTTPException(
            status_code=401,
            detail="Authentication required",
        )

    if not AUTH_SECRET_KEY:
        raise HTTPException(
            status_code=500,
            detail="Authentication secret is not configured",
        )

    try:
        payload = jwt.decode(
            tara_admin_token,
            AUTH_SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        username = payload.get("sub")
        role = payload.get("role")

        if not username or role != "admin":
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token",
            )

        return {
            "username": username,
            "role": role,
        }

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired authentication token",
        )