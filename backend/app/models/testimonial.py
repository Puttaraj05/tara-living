from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Testimonial(Base):
    __tablename__ = "testimonials"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    client_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    location: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    property_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    rating: Mapped[int] = mapped_column(
        Integer,
        default=5,
        nullable=False,
    )

    review: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    image: Mapped[str] = mapped_column(
        String(255),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )