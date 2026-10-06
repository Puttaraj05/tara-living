import os
import uuid

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.service import Service
from app.schemas.service import ServiceCreate
from app.core.auth import require_admin
from app.core.uploads import (
    MAX_IMAGE_SIZE,
    validate_upload,
)


router = APIRouter(
    prefix="/api/services",
    tags=["Services"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

# Upload service image
@router.post("/upload-image")
async def upload_service_image(
    file: UploadFile = File(...),
    admin=Depends(require_admin),
):
    allowed_types = {
      "image/jpeg",
     "image/png",
      "image/webp",
    }

    file_content = await validate_upload(
      file=file,
       allowed_types=allowed_types,
       max_size=MAX_IMAGE_SIZE,
    )

    upload_directory = "uploads/services"

    os.makedirs(upload_directory, exist_ok=True)

    file_extension = os.path.splitext(file.filename)[1].lower()

    unique_filename = f"{uuid.uuid4()}{file_extension}"

    file_path = os.path.join(
     upload_directory,
     unique_filename,
    )

    with open(file_path, "wb") as buffer:
        buffer.write(file_content)

    return {
        "message": "Service image uploaded successfully",
        "image": f"/uploads/services/{unique_filename}",
    }

# Create service
@router.post("/")
def create_service(
    service: ServiceCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    new_service = Service(
        title=service.title,
        category=service.category,
        description=service.description,
        image=service.image,
        service_items=service.service_items,
    )

    db.add(new_service)
    db.commit()
    db.refresh(new_service)

    return {
        "message": "Service created successfully",
        "id": new_service.id,
    }


# Get all services
@router.get("/")
def get_services(
    db: Session = Depends(get_db),
):
    services = (
        db.query(Service)
        .order_by(Service.created_at.desc())
        .all()
    )

    return services


# Get single service
@router.get("/{service_id}")
def get_service(
    service_id: int,
    db: Session = Depends(get_db),
):
    service = (
        db.query(Service)
        .filter(Service.id == service_id)
        .first()
    )

    if not service:
        raise HTTPException(
           status_code=404,
           detail="Service not found",
       )

    return service


# Update service
@router.put("/{service_id}")
def update_service(
    service_id: int,
    service: ServiceCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    existing_service = (
        db.query(Service)
        .filter(Service.id == service_id)
        .first()
    )

    if not existing_service:
        raise HTTPException(
            status_code=404,
            detail="Service not found",
        )

    existing_service.title = service.title
    existing_service.category = service.category
    existing_service.description = service.description
    existing_service.image = service.image
    existing_service.service_items = service.service_items
    db.commit()
    db.refresh(existing_service)

    return {
        "message": "Service updated successfully",
        "id": existing_service.id,
    }


# Delete service
@router.delete("/{service_id}")
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    service = (
        db.query(Service)
        .filter(Service.id == service_id)
        .first()
    )

    if not service:
        raise HTTPException(
            status_code=404,
            detail="Service not found",
        )

    db.delete(service)
    db.commit()

    return {
        "message": "Service deleted successfully",
        "id": service_id,
    }