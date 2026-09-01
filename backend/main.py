from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from pydantic import BaseModel, Field, EmailStr
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Float,
    DateTime as DateTimeType,
    Boolean,
    DateTime as DateTimeDB,
    create_engine,
    event,
    MetaData,
    Table,
    select,
    func,
    or_,
)
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func as sqlfunc
import os
import datetime
from dotenv import load_dotenv
from typing import Optional, List
from enum import Enum

load_dotenv()

# Configuration
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
POSTGRES_PORT = int(os.getenv("POSTGRES_PORT", "5432"))
POSTGRES_DB = os.getenv("POSTGRES_DB", "gharbudget")
POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "password")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Database setup
DATABASE_URL = f"postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

engine: AsyncEngine = create_async_engine(DATABASE_URL, echo=True, future=True)
SessionLocal = sessionmaker(engine, class_=AsyncSession)
metadata = MetaData()

# Role Enum
class UserRole(str, Enum):
    GUEST = "guest"
    USER = "user"
    ADMIN = "admin"

# Tables
users_table = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("email", String(255), unique=True, index=True, nullable=False),
    Column("full_name", String(255), nullable=True),
    Column("password_hash", String(255), nullable=False),
    Column("role", String(20), default=UserRole.USER.value, nullable=False),
    Column("is_active", Boolean, default=True, nullable=False),
    Column("is_verified", Boolean, default=False, nullable=False),
    Column("last_login", DateTimeDB(timezone=True), nullable=True),
    Column("created_at", DateTimeDB(timezone=True), server_default=sqlfunc.now(), nullable=False),
    Column("updated_at", DateTimeDB(timezone=True), server_default=sqlfunc.now(), onupdate=sqlfunc.now(), nullable=False),
)

# Create tables on startup
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(metadata.create_all)
    # Create default admin if not exists
    await create_default_admin()

async def create_default_admin():
    async with SessionLocal() as db:
        query = users_table.select().where(users_table.c.email == "admin@gharbudget.app")
        result = await db.execute(query)
        if not result.fetchone():
            password_hash = pwd_context.hash("Admin@12345")
            now = datetime.datetime.utcnow()
            insert_query = users_table.insert().values(
                email="admin@gharbudget.app",
                full_name="System Administrator",
                password_hash=password_hash,
                role=UserRole.ADMIN.value,
                is_active=True,
                is_verified=True,
                created_at=now,
                updated_at=now,
            )
            await db.execute(insert_query)
            await db.commit()
            print("Default admin created: admin@gharbudget.app / Admin@12345")

# FastAPI app
app = FastAPI(
    title="GharBudget & GaunSewa Backend",
    version="0.1.0",
    description="Backend API with RBAC for GharBudget & GaunSewa",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# ===== Pydantic Schemas =====

class UserRoleEnum(str, Enum):
    GUEST = "guest"
    USER = "user"
    ADMIN = "admin"

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str | None = Field(default=None, max_length=255)
    password: str = Field(..., min_length=8, max_length=128)

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    is_admin: bool = False  # Flag for admin login

class AdminUserCreate(BaseModel):
    email: EmailStr
    full_name: str | None = Field(default=None, max_length=255)
    password: str = Field(..., min_length=8, max_length=128)
    role: UserRoleEnum = UserRoleEnum.USER
    is_active: bool = True

class AdminUserUpdate(BaseModel):
    full_name: str | None = Field(default=None, max_length=255)
    role: UserRoleEnum | None = None
    is_active: bool | None = None
    is_verified: bool | None = None

class UserPublic(BaseModel):
    id: int
    email: str
    full_name: str | None = None
    role: str
    is_active: bool
    is_verified: bool
    last_login: datetime.datetime | None = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class UserListResponse(BaseModel):
    users: List[UserPublic]
    total: int
    page: int
    page_size: int
    total_pages: int

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic

class MessageResponse(BaseModel):
    message: str

# Dependency to get DB session
async def get_db() -> AsyncSession:
    async with SessionLocal() as session:
        yield session

# Auth functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: datetime.timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ===== Authentication Dependencies =====

async def get_current_user(
    db: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str | None = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    query = users_table.select().where(users_table.c.email == email)
    result = await db.execute(query)
    user_row = result.fetchone()
    if user_row is None:
        raise credentials_exception
    return dict(user_row._mapping)

def get_current_active_user(current_user: dict = Depends(get_current_user)) -> dict:
    if not current_user.get("is_active"):
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def get_current_admin_user(current_user: dict = Depends(get_current_active_user)) -> dict:
    if current_user.get("role") != UserRole.ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

# ===== Auth Routes =====

@app.post("/v1/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    """Register a new user (public registration - creates USER role)."""
    query = users_table.select().where(users_table.c.email == user_in.email.lower())
    result = await db.execute(query)
    existing_user = result.fetchone()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    password_hash = get_password_hash(user_in.password)
    now = datetime.datetime.utcnow()
    insert_query = users_table.insert().values(
        email=user_in.email.lower(),
        full_name=user_in.full_name,
        password_hash=password_hash,
        role=UserRole.USER.value,
        is_active=True,
        is_verified=False,
        created_at=now,
        updated_at=now,
    )
    await db.execute(insert_query)
    await db.commit()

    # Get created user
    query = users_table.select().where(users_table.c.email == user_in.email.lower())
    result = await db.execute(query)
    user_row = result.fetchone()
    user = dict(user_row._mapping)

    access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_in.email.lower()}, expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserPublic(**user)
    }

@app.post("/v1/login", response_model=Token)
async def login(
    user_in: UserLogin,
    db: AsyncSession = Depends(get_db),
):
    """Login user or admin."""
    query = users_table.select().where(users_table.c.email == user_in.email.lower())
    result = await db.execute(query)
    user_row = result.fetchone()
    
    if not user_row:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = dict(user_row._mapping)

    if not verify_password(user_in.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check admin access if requested
    if user_in.is_admin and user["role"] != UserRole.ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required for this login"
        )

    # Update last_login
    now = datetime.datetime.utcnow()
    update_query = users_table.update().where(users_table.c.id == user["id"]).values(last_login=now, updated_at=now)
    await db.execute(update_query)
    await db.commit()

    access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserPublic(**user)
    }

# ===== Protected User Routes =====

@app.get("/v1/me", response_model=UserPublic)
async def get_me(current_user: dict = Depends(get_current_active_user)):
    """Get current user profile."""
    return UserPublic(**current_user)

class UserProfileUpdate(BaseModel):
    full_name: str | None = Field(default=None, max_length=255)

@app.put("/v1/me", response_model=UserPublic)
async def update_me(
    update_data: UserProfileUpdate,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Update current user profile (limited fields)."""
    allowed_fields = {"full_name"}
    update_values = {k: v for k, v in update_data.items() if k in allowed_fields}
    if not update_values:
        raise HTTPException(status_code=400, detail="No valid fields to update")
    
    update_values["updated_at"] = datetime.datetime.utcnow()
    update_query = users_table.update().where(users_table.c.id == current_user["id"]).values(**update_values)
    await db.execute(update_query)
    await db.commit()
    
    # Return updated user
    query = users_table.select().where(users_table.c.id == current_user["id"])
    result = await db.execute(query)
    user_row = result.fetchone()
    return UserPublic(**dict(user_row._mapping))

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)

@app.put("/v1/me/password")
async def change_password(
    request: ChangePasswordRequest,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Change current user's password."""
    query = users_table.select().where(users_table.c.id == current_user["id"])
    result = await db.execute(query)
    user_row = result.fetchone()
    if not user_row:
        raise HTTPException(status_code=404, detail="User not found")
    user = dict(user_row._mapping)
    
    if not verify_password(current_password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    password_hash = get_password_hash(new_password)
    update_query = users_table.update().where(users_table.c.id == current_user["id"]).values(
        password_hash=password_hash,
        updated_at=datetime.datetime.utcnow()
    )
    await db.execute(update_query)
    await db.commit()
    
    return {"message": "Password changed successfully"}

@app.post("/v1/logout")
async def logout():
    return {"message": "Successfully logged out"}

# ===== Admin Routes =====

@app.get("/v1/admin/users", response_model=UserListResponse)
async def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str | None = Query(None),
    role: str | None = Query(None),
    is_active: bool | None = Query(None),
    current_admin: dict = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """List all users with pagination, search, and filters (Admin only)."""
    query = users_table.select()
    
    # Apply filters
    if search:
        search_term = f"%{search.lower()}%"
        query = query.where(
            or_(
                users_table.c.email.ilike(search_term),
                users_table.c.full_name.ilike(search_term)
            )
        )
    if role:
        query = query.where(users_table.c.role == role)
    if is_active is not None:
        query = query.where(users_table.c.is_active == is_active)
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Apply pagination
    query = query.order_by(users_table.c.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    users = [dict(row._mapping) for row in result.fetchall()]
    
    total_pages = (total + page_size - 1) // page_size
    
    return UserListResponse(
        users=[UserPublic(**u) for u in users],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

@app.get("/v1/admin/users/{user_id}", response_model=UserPublic)
async def get_user(
    user_id: int,
    current_admin: dict = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific user by ID (Admin only)."""
    query = users_table.select().where(users_table.c.id == user_id)
    result = await db.execute(query)
    user_row = result.fetchone()
    if not user_row:
        raise HTTPException(status_code=404, detail="User not found")
    return UserPublic(**dict(user_row._mapping))

@app.post("/v1/admin/users", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_in: AdminUserCreate,
    current_admin: dict = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new user (Admin only)."""
    query = users_table.select().where(users_table.c.email == user_in.email.lower())
    result = await db.execute(query)
    if result.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered")

    password_hash = get_password_hash(user_in.password)
    now = datetime.datetime.utcnow()
    insert_query = users_table.insert().values(
        email=user_in.email.lower(),
        full_name=user_in.full_name,
        password_hash=password_hash,
        role=user_in.role.value,
        is_active=user_in.is_active,
        is_verified=False,
        created_at=now,
        updated_at=now,
    )
    await db.execute(insert_query)
    await db.commit()

    query = users_table.select().where(users_table.c.email == user_in.email.lower())
    result = await db.execute(query)
    user_row = result.fetchone()
    return UserPublic(**dict(user_row._mapping))

@app.put("/v1/admin/users/{user_id}", response_model=UserPublic)
async def update_user(
    user_id: int,
    user_in: AdminUserUpdate,
    current_admin: dict = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a user (Admin only)."""
    query = users_table.select().where(users_table.c.id == user_id)
    result = await db.execute(query)
    user_row = result.fetchone()
    if not user_row:
        raise HTTPException(status_code=404, detail="User not found")
    user = dict(user_row._mapping)

    # Prevent admin from demoting themselves
    if user_id == current_admin["id"] and user_in.role == UserRoleEnum.USER:
        raise HTTPException(status_code=400, detail="Cannot demote yourself")

    update_data = user_in.model_dump(exclude_unset=True)
    if "role" in update_data:
        update_data["role"] = update_data["role"].value
    update_data["updated_at"] = datetime.datetime.utcnow()
    
    update_query = users_table.update().where(users_table.c.id == user_id).values(**update_data)
    await db.execute(update_query)
    await db.commit()

    query = users_table.select().where(users_table.c.id == user_id)
    result = await db.execute(query)
    updated_user_row = result.fetchone()
    return UserPublic(**dict(updated_user_row._mapping))

@app.delete("/v1/admin/users/{user_id}")
async def delete_user(
    user_id: int,
    current_admin: dict = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a user (Admin only)."""
    if user_id == current_admin["id"]:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")

    query = users_table.select().where(users_table.c.id == user_id)
    result = await db.execute(query)
    user_row = result.fetchone()
    if not user_row:
        raise HTTPException(status_code=404, detail="User not found")
    user = dict(user_row._mapping)

    delete_query = users_table.delete().where(users_table.c.id == user_id)
    await db.execute(delete_query)
    await db.commit()
    
    return {"message": "User deleted successfully"}

@app.post("/v1/admin/users/{user_id}/activate")
async def activate_user(
    user_id: int,
    current_admin: dict = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Activate a user (Admin only)."""
    if user_id == current_admin["id"]:
        raise HTTPException(status_code=400, detail="Cannot modify your own status")
    
    query = users_table.select().where(users_table.c.id == user_id)
    result = await db.execute(query)
    user_row = result.fetchone()
    if not user_row:
        raise HTTPException(status_code=404, detail="User not found")
    user = dict(user_row._mapping)
    
    update_query = users_table.update().where(users_table.c.id == user_id).values(
        is_active=True,
        updated_at=datetime.datetime.utcnow()
    )
    await db.execute(update_query)
    await db.commit()
    return {"message": "User activated"}

@app.post("/v1/admin/users/{user_id}/deactivate")
async def deactivate_user(
    user_id: int,
    current_admin: dict = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Deactivate a user (Admin only)."""
    if user_id == current_admin["id"]:
        raise HTTPException(status_code=400, detail="Cannot deactivate yourself")
    
    query = users_table.select().where(users_table.c.id == user_id)
    result = await db.execute(query)
    user_row = result.fetchone()
    if not user_row:
        raise HTTPException(status_code=404, detail="User not found")
    user = dict(user_row._mapping)
    
    update_query = users_table.update().where(users_table.c.id == user_id).values(
        is_active=False,
        updated_at=datetime.datetime.utcnow()
    )
    await db.execute(update_query)
    await db.commit()
    return {"message": "User deactivated"}

# ===== Health =====

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/")
async def root():
    return {"message": "GharBudget & GaunSewa API", "version": "0.1.0"}

# Startup event
@app.on_event("startup")
async def on_startup():
    await init_db()