from pydantic import BaseModel, EmailStr


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    city: str
    property_type: str
    project_type: str
    budget: str
    message: str