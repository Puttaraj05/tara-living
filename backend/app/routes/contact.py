from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.contact import Contact
from app.schemas.contact import ContactCreate


router = APIRouter(prefix="/api/contact", tags=["Contact"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def create_contact(
    contact: ContactCreate,
    db: Session = Depends(get_db),
):
    new_contact = Contact(
        name=contact.name,
        email=contact.email,
        phone=contact.phone,
        city=contact.city,
        property_type=contact.property_type,
        project_type=contact.project_type,
        budget=contact.budget,
        message=contact.message,
    )

    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)

    return {
        "message": "Inquiry submitted successfully",
        "id": new_contact.id,
    }

@router.get("/")
def get_contacts(db: Session = Depends(get_db)):
    contacts = db.query(Contact).order_by(Contact.created_at.desc()).all()

    return contacts

@router.patch("/{contact_id}/status")
def update_contact_status(
    contact_id: int,
    status: str,
    db: Session = Depends(get_db),
):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()

    if not contact:
        return {
            "message": "Client not found"
        }

    contact.status = status

    db.commit()
    db.refresh(contact)

    return {
        "message": "Client status updated successfully",
        "id": contact.id,
        "status": contact.status,
    }