from datetime import datetime
from decimal import Decimal
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, validator


# --- Authentication ---

class UserCreate(BaseModel):
    email: str = Field(..., min_length=1, max_length=255)
    full_name: str | None = Field(default=None, max_length=255)
    password: str = Field(..., min_length=6)

    @validator("email")
    def validate_email(cls, v):
        if "@" not in v:
            raise ValueError("Valid email required")
        return v.lower()


class UserLogin(BaseModel):
    email: str = Field(..., min_length=1, max_length=255)
    password: str

    @validator("email")
    def validate_email(cls, v):
        if "@" not in v:
            raise ValueError("Valid email required")
        return v.lower()


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


# --- User ---

class UserPublic(BaseModel):
    id: int
    email: str
    full_name: str | None = None
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


# --- Transaction ---

class TransactionCreate(BaseModel):
    amount: float = Field(..., gt=0)
    description: str | None = Field(default=None, max_length=500)
    category: str = Field(..., min_length=1, max_length=100)
    type: str = Field(..., min_length=1, max_length=20)  # "income" or "expense"
    date: str = Field(..., description="ISO date string like YYYY-MM-DD")

    @validator("type")
    def validate_type(cls, v):
        if v not in ("income", "expense"):
            raise ValueError("Type must be 'income' or 'expense'")
        return v


class TransactionInDB(TransactionCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class TransactionUpdate(BaseModel):
    amount: Optional[float] = None
    description: Optional[str] = None
    category: Optional[str] = None
    type: Optional[str] = None
    date: Optional[str] = None


# --- Financial Goal ---

class GoalCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    target_amount: float = Field(..., gt=0)
    target_date: str | None = Field(default=None, description="ISO date string")
    category: str | None = Field(default=None, max_length=100)
    is_active: bool = Field(default=True)


class GoalInDB(BaseModel):
    id: int
    user_id: int
    name: str
    target_amount: float
    current_amount: float = 0.0
    target_date: str | None
    category: str | None
    is_active: bool
    created_at: datetime
    deposits_count: int = 0

    class Config:
        from_attributes = True


class GoalDepositCreate(BaseModel):
    amount: float = Field(..., gt=0)
    description: str | None = Field(default=None, max_length=500)


class GoalDepositInDB(GoalDepositCreate):
    id: int
    goal_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- Job Listing ---

class JobListingCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    budget: float | None = Field(default=None, ge=0)
    budget_currency: str = Field(default="NPR", max_length=3)
    rate_type: str | None = Field(
        default=None, pattern="^(daily|total|hourly)$"
    )
    location: str | None = Field(default=None, max_length=200)
    timeline: str | None = Field(default=None, max_length=100)
    tags: List[str] = Field(default=[], max_items=20)
    perks: str | None = Field(default=None, max_length=500)
    contact_phone: str | None = Field(default=None, max_length=50)


class JobListingInDB(JobListingCreate):
    id: int
    poster_id: int
    created_at: datetime
    applications_count: int = 0

    class Config:
        from_attributes = True


class JobListingUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, min_length=1)
    budget: Optional[float] = Field(default=None, ge=0)
    budget_currency: Optional[str] = Field(default=None, max_length=3)
    rate_type: Optional[str] = Field(default=None, pattern="^(daily|total|hourly)$")
    location: Optional[str] = Field(default=None, max_length=200)
    timeline: Optional[str] = Field(default=None, max_length=100)
    tags: Optional[List[str]] = Field(default=None, max_items=20)
    perks: Optional[str] = Field(default=None, max_length=500)
    contact_phone: Optional[str] = Field(default=None, max_length=50)
    is_active: Optional[bool] = None


# --- Job Application ---

class JobApplicationCreate(BaseModel):
    listing_id: int
    cover_letter: str | None = Field(default=None, max_length=1000)


class JobApplicationInDB(JobApplicationCreate):
    id: int
    user_id: int
    listing_id: int
    status: str = "pending"
    applied_at: datetime

    class Config:
        from_attributes = True


# --- Remittance ---

class RemittanceCreate(BaseModel):
    amount: float = Field(..., gt=0)
    sender: str | None = Field(default=None, max_length=200)
    country: str | None = Field(default=None, max_length=100)
    purpose: str | None = Field(default=None, max_length=500)
    date: str = Field(..., description="ISO date string like YYYY-MM-DD")


class RemittanceInDB(RemittanceCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- User Profile ---

class UserProfileCreate(BaseModel):
    currency: str = Field(default="NPR", max_length=3)
    locale: str = Field(default="ne_NP", max_length=20)
    theme: str = Field(default="light", max_length=20)
    notification_preferences: Dict[str, Any] = Field(default={})


class UserProfileInDB(UserProfileCreate):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- Category ---

class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., min_length=1, max_length=100)
    color: str = Field(default="#3B82F6", max_length=7)
    icon: str | None = Field(default=None, max_length=50)
    description: str | None = Field(default=None, max_length=500)
    is_expense: bool = Field(default=True)
    is_income: bool = Field(default=False)


class CategoryInDB(CategoryCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- Settings ---

class SettingsUpdate(BaseModel):
    theme: str | None = Field(default=None, pattern="^(light|dark)$")
    currency: str | None = Field(default=None, max_length=3)
    locale: str | None = Field(default=None, max_length=20)
    notification_preferences: Dict[str, Any] | None = Field(default=None)


# --- Response ---

class APIResponse(BaseModel):
    success: bool = True
    message: str = ""
    data: Any = None


class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    error_code: str | None = None