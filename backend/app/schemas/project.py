from typing import Optional

from pydantic import BaseModel


class ProjectCreate(BaseModel):
    title: str
    location: str
    category: str
    image: str
    gallery_images: Optional[str] = None
    description: str
    work_done: str
    client_review: Optional[str] = None

    # Project detail content
    tour_video: Optional[str] = None
    story_title: Optional[str] = None
    story_text: Optional[str] = None
    materials: Optional[str] = None
    lighting: Optional[str] = None
    space_story: Optional[str] = None
    client_video: Optional[str] = None
    client_name: Optional[str] = None