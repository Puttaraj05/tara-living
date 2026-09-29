from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.database import Base, engine
from app.models.contact import Contact
from app.models.project import Project
from app.models.service import Service
from app.models.testimonial import Testimonial
from app.routes.contact import router as contact_router
from app.routes.project import router as project_router
from app.routes.service import router as service_router
from app.routes.testimonial import router as testimonial_router

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Tara Living API",
    description="Backend API for Tara Living Interior Design",
    version="1.0.0",
)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(contact_router)
app.include_router(project_router)
app.include_router(service_router)
app.include_router(testimonial_router)
@app.get("/")
def root():
    return {
        "message": "Tara Living API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/health/db")
def database_health():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "connected"
        }

    except Exception as error:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(error)
        }