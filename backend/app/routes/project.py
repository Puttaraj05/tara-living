import json
import os
import uuid

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.project import Project
from app.schemas.project import ProjectCreate
from app.core.auth import require_admin


router = APIRouter(
    prefix="/api/projects",
    tags=["Projects"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# Upload project image
@router.post("/upload-image")
async def upload_project_image(
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

    upload_directory = "uploads/projects"

    os.makedirs(upload_directory, exist_ok=True)

    file_extension = os.path.splitext(file.filename)[1].lower()
    unique_filename = f"{uuid.uuid4()}{file_extension}"

    file_path = os.path.join(
        upload_directory,
        unique_filename,
    )

    file_content = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(file_content)

    return {
        "message": "Project image uploaded successfully",
        "image": f"/uploads/projects/{unique_filename}",
    }

# Upload project video
@router.post("/upload-video")
async def upload_project_video(
    file: UploadFile = File(...),
    admin=Depends(require_admin),
):
    allowed_types = {
        "video/mp4",
        "video/webm",
        "video/quicktime",
    }

    if file.content_type not in allowed_types:
        return {
            "message": "Only MP4, WEBM and MOV videos are allowed"
        }

    upload_directory = "uploads/projects/videos"

    os.makedirs(upload_directory, exist_ok=True)

    file_extension = os.path.splitext(file.filename)[1].lower()

    unique_filename = f"{uuid.uuid4()}{file_extension}"

    file_path = os.path.join(
        upload_directory,
        unique_filename,
    )

    file_content = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(file_content)

    return {
        "message": "Project video uploaded successfully",
        "video": f"/uploads/projects/videos/{unique_filename}",
    }

# Upload project gallery image
@router.post("/upload-gallery-image")
async def upload_project_gallery_image(
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

    upload_directory = "uploads/projects/gallery"

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

    file_content = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(file_content)

    return {
        "message": "Project gallery image uploaded successfully",
        "image": (
            f"/uploads/projects/gallery/"
            f"{unique_filename}"
        ),
    }

# Create project
@router.post("/")
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    new_project = Project(
        title=project.title,
        location=project.location,
        category=project.category,
        image=project.image,
        gallery_images=project.gallery_images,
        description=project.description,
        work_done=project.work_done,
        client_review=project.client_review,

        # Project detail content
        tour_video=project.tour_video,
        story_title=project.story_title,
        story_text=project.story_text,
        materials=project.materials,
        lighting=project.lighting,
        space_story=project.space_story,
        client_video=project.client_video,
        client_name=project.client_name,
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return {
        "message": "Project created successfully",
        "id": new_project.id,
    }

# Get all projects
@router.get("/")
def get_projects(
    db: Session = Depends(get_db),
):
    projects = (
        db.query(Project)
        .order_by(Project.created_at.desc())
        .all()
    )

    return projects

@router.get("/{project_id}")
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        return {
            "message": "Project not found"
        }

    return project
#update project
@router.put("/{project_id}")
def update_project(
    project_id: int,
    project: ProjectCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    existing_project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not existing_project:
        return {
            "message": "Project not found"
        }

    existing_project.title = project.title
    existing_project.location = project.location
    existing_project.category = project.category
    existing_project.image = project.image
    existing_project.gallery_images = project.gallery_images
    existing_project.description = project.description
    existing_project.work_done = project.work_done
    existing_project.client_review = project.client_review

    # Project detail content
    existing_project.tour_video = project.tour_video
    existing_project.story_title = project.story_title
    existing_project.story_text = project.story_text
    existing_project.materials = project.materials
    existing_project.lighting = project.lighting
    existing_project.space_story = project.space_story
    existing_project.client_video = project.client_video
    existing_project.client_name = project.client_name

    db.commit()
    db.refresh(existing_project)

    return {
        "message": "Project updated successfully",
        "id": existing_project.id,
    }

# Delete project
@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        return {
            "message": "Project not found"
        }

    db.delete(project)
    db.commit()

    return {
        "message": "Project deleted successfully",
        "id": project_id,
    }