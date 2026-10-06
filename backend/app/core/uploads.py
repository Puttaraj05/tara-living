from pathlib import Path
from typing import Optional

from fastapi import HTTPException, UploadFile, status


MAX_IMAGE_SIZE = 10 * 1024 * 1024
MAX_VIDEO_SIZE = 100 * 1024 * 1024


IMAGE_SIGNATURES = {
    "image/jpeg": (
        b"\xff\xd8\xff",
    ),
    "image/png": (
        b"\x89PNG\r\n\x1a\n",
    ),
    "image/webp": (
        b"RIFF",
    ),
}

VIDEO_SIGNATURES = {
    "video/mp4": (
        b"ftyp",
    ),
    "video/quicktime": (
        b"ftyp",
    ),
    "video/webm": (
        b"\x1a\x45\xdf\xa3",
    ),
}


async def validate_upload(
    file: UploadFile,
    allowed_types: set[str],
    max_size: int,
) -> bytes:
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must have a filename",
        )

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Unsupported file type",
        )

    file_content = await file.read(max_size + 1)

    if len(file_content) > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File is too large. Maximum allowed size is {max_size // (1024 * 1024)} MB",
        )

    if file.content_type.startswith("image/"):
        signatures = IMAGE_SIGNATURES.get(file.content_type)

        if not signatures:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail="Unsupported image type",
            )

        if file.content_type == "image/webp":
            if (
                len(file_content) < 12
                or file_content[:4] != b"RIFF"
                or file_content[8:12] != b"WEBP"
            ):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Uploaded file is not a valid WEBP image",
                )
        elif not any(
            file_content.startswith(signature)
            for signature in signatures
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file content does not match its declared type",
            )

    elif file.content_type in {
        "video/mp4",
        "video/quicktime",
        "video/webm",
    }:
        if file.content_type == "video/webm":
            valid = file_content.startswith(b"\x1a\x45\xdf\xa3")
        else:
            valid = (
                len(file_content) >= 12
                and file_content[4:8] == b"ftyp"
            )

        if not valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file content does not match its declared type",
            )

    return file_content