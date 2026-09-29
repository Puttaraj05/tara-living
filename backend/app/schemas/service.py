from typing import List, Optional

from pydantic import BaseModel


class ServiceCreate(BaseModel):
    title: str
    category: str
    description: str
    image: str
    service_items: Optional[List[str]] = None