from datetime import datetime, timedelta, timezone

from jose import jwt, JWTError
from passlib.context import CryptContext

from app.config import settings


# ==========================================
# PASSWORD HASHING CONFIGURATION
# ==========================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# ==========================================
# HASH PASSWORD
# ==========================================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# ==========================================
# VERIFY PASSWORD
# ==========================================

def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    return pwd_context.verify(
        plain_password,
        hashed_password
    )


# ==========================================
# CREATE JWT ACCESS TOKEN
# ==========================================

def create_access_token(
    data: dict,
    expires_delta: timedelta = None
) -> str:

    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({
        "exp": expire
    })

    encoded_j