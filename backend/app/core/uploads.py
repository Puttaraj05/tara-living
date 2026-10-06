from fastapi import HTTPException, UploadFile, status


MAX_IMAGE_SIZE = 50 * 1024 * 1024
MAX_VIDEO_SIZE = 500 * 1024 * 1024


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


async def validate_upload(
    file: UploadFile,
    allowed_types: set[str],
    max_size: int,
) -> None:
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

    # Check the file signature without loading the entire file.
    await file.seek(0)

    header = await file.read(32)

    if file.content_type.startswith("image/"):
        signatures = IMAGE_SIGNATURES.get(file.content_type)

        if not signatures:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail="Unsupported image type",
            )

        if file.content_type == "image/webp":
            if (
                len(header) < 12
                or header[:4] != b"RIFF"
                or header[8:12] != b"WEBP"
            ):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Uploaded file is not a valid WEBP image",
                )

        elif not any(
            header.startswith(signature)
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
            valid = header.startswith(b"\x1a\x45\xdf\xa3")
        else:
            valid = (
                len(header) >= 12
                and header[4:8] == b"ftyp"
            )

        if not valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file content does not match its declared type",
            )

    # Move back to the beginning so R2 receives the complete file.
    await file.seek(0)

    # UploadFile uses a spooled temporary file underneath.
    # Check its current size without reading the entire object.
    file_object = file.file

    current_position = file_object.tell()
    file_object.seek(0, 2)
    file_size = file_object.tell()
    file_object.seek(current_position)

    if file_size > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=(
                "File is too large. Maximum allowed size is "
                f"{max_size // (1024 * 1024)} MB"
            ),
        )