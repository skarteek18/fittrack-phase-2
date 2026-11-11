from datetime import date, datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr, Field, ConfigDict


# ==========================================
# COMMON CONFIGURATION
# ==========================================

class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# ==========================================
# USER SCHEMAS
# ==========================================

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class UserResponse(BaseSchema):
    id: int
    name: str
    email: EmailStr
    created_at: Optional[datetime] = None


# ==========================================
# AUTHENTICATION SCHEMAS
# ==========================================

class LoginRequest(BaseModel