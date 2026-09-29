from typing import Optional

from pydantic import BaseModel


class TestimonialCreate(BaseModel):
    client_name: str
    location: str
    property_type: str
    rating: int = 5
    review: str
    image: Optional[str] = None