import os
import uuid

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.testimonial import Testimonial
from app.schemas.testimonial import TestimonialCreate
from app.core.auth import require_admin
from app.core.uploads import (
    MAX_IMAGE_SIZE,
    validate_upload,
)


router = APIRouter(
    prefix="/api/testimonials",
    tags=["Testimonials"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/upload-image")
async def upload_testimonial_image(
    file: UploadFile = File(...),
    admin=Depends(require_admin),
):
    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    if file.content_type not in allowed_types:
        return {
            "message": "Only JPG, PNG and WEBP images are allowed"
        }

    upload_directory = "uploads/testimonials"

    os.makedirs(upload_directory, exist_ok=True)

    file_extension = os.path.splitext(
        file.filename
    )[1].lower()

    unique_filename = (
        f"{uuid.uuid4()}{file_extension}"
    )

    file_path = os.path.join(
        upload_directory,
        unique_filename,
    )

    file_content = await validate_upload(

    file=file,

    allowed_types=allowed_types,

    max_size=MAX_IMAGE_SIZE,

    )

    with open(file_path, "wb") as buffer:
        buffer.write(file_content)

    return {
        "message": "Testimonial image uploaded successfully",
        "image": f"/uploads/testimonials/{unique_filename}",
    }


@router.post("/")
def create_testimonial(
    testimonial: TestimonialCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    new_testimonial = Testimonial(
        client_name=testimonial.client_name,
        location=testimonial.location,
        property_type=testimonial.property_type,
        rating=testimonial.rating,
        review=testimonial.review,
        image=testimonial.image,
    )

    db.add(new_testimonial)
    db.commit()
    db.refresh(new_testimonial)

    return {
        "message": "Testimonial created successfully",
        "id": new_testimonial.id,
    }


@router.get("/")
def get_testimonials(
    db: Session = Depends(get_db),
):
    testimonials = (
        db.query(Testimonial)
        .order_by(Testimonial.created_at.desc())
        .all()
    )

    return testimonials


@router.get("/{testimonial_id}")
def get_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
):
    testimonial = (
        db.query(Testimonial)
        .filter(
            Testimonial.id == testimonial_id
        )
        .first()
    )

    if not testimonial:
       raise HTTPException(
           status_code=404,
           detail="Testimonial not found",
       )

    return testimonial


@router.put("/{testimonial_id}")
def update_testimonial(
    testimonial_id: int,
    testimonial: TestimonialCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    existing_testimonial = (
        db.query(Testimonial)
        .filter(
            Testimonial.id == testimonial_id
        )
        .first()
    )

    if not existing_testimonial:
       raise HTTPException(
           status_code=404,
           detail="Testimonial not found",
       )

    existing_testimonial.client_name = (
        testimonial.client_name
    )

    existing_testimonial.location = (
        testimonial.location
    )

    existing_testimonial.property_type = (
        testimonial.property_type
    )

    existing_testimonial.rating = (
        testimonial.rating
    )

    existing_testimonial.review = (
        testimonial.review
    )

    existing_testimonial.image = (
        testimonial.image
    )

    db.commit()
    db.refresh(existing_testimonial)

    return {
        "message": "Testimonial updated successfully",
        "id": existing_testimonial.id,
    }


@router.delete("/{testimonial_id}")
def delete_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),

):
    testimonial = (
        db.query(Testimonial)
        .filter(
            Testimonial.id == testimonial_id
        )
        .first()
    )

    if not testimonial:
        raise HTTPException(
            status_code=404,
            detail="Testimonial not found",
        )

    db.delete(testimonial)
    db.commit()

    return {
        "message": "Testimonial deleted successfully",
        "id": testimonial_id,
    }