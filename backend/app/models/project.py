from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    location: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    category: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    image: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    gallery_images: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    work_done: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    client_review: Mapped[str] = mapped_column(
        Text,
        nullable=True,
    )

    # =========================================
    # PROJECT DETAIL CONTENT
    # =========================================

    tour_video: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )

    story_title: Mapped[Optional[str]] = mapped_column(
        String(200),
        nullable=True,
    )

    story_text: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    materials: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    lighting: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    space_story: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    client_video: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )

    client_name: Mapped[Optional[str]] = mapped_column(
        String(150),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )