import os

from dotenv import load_dotenv
import boto3
from botocore.config import Config


load_dotenv()


R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID")
R2_ACCESS_KEY_ID = os.getenv("R2_ACCESS_KEY_ID")
R2_SECRET_ACCESS_KEY = os.getenv("R2_SECRET_ACCESS_KEY")
R2_BUCKET_NAME = os.getenv("R2_BUCKET_NAME")
R2_ENDPOINT = os.getenv("R2_ENDPOINT")
R2_PUBLIC_URL = os.getenv("R2_PUBLIC_URL")


def get_r2_client():
    required = {
        "R2_ACCOUNT_ID": R2_ACCOUNT_ID,
        "R2_ACCESS_KEY_ID": R2_ACCESS_KEY_ID,
        "R2_SECRET_ACCESS_KEY": R2_SECRET_ACCESS_KEY,
        "R2_BUCKET_NAME": R2_BUCKET_NAME,
        "R2_ENDPOINT": R2_ENDPOINT,
        "R2_PUBLIC_URL": R2_PUBLIC_URL,
    }

    missing = [
        name
        for name, value in required.items()
        if not value
    ]

    if missing:
        raise RuntimeError(
            f"Missing R2 environment variables: {', '.join(missing)}"
        )

    return boto3.client(
        "s3",
        endpoint_url=R2_ENDPOINT,
        aws_access_key_id=R2_ACCESS_KEY_ID,
        aws_secret_access_key=R2_SECRET_ACCESS_KEY,
        region_name="auto",
        config=Config(
            signature_version="s3v4",
        ),
    )


def upload_file_to_r2(
    file_object,
    object_key: str,
    content_type: str,
):
    client = get_r2_client()

    client.upload_fileobj(
        file_object,
        R2_BUCKET_NAME,
        object_key,
        ExtraArgs={
            "ContentType": content_type,
        },
    )

    return object_key


def get_r2_public_url(object_key: str) -> str:
    if not R2_PUBLIC_URL:
        raise RuntimeError(
            "Missing R2_PUBLIC_URL environment variable"
        )

    return f"{R2_PUBLIC_URL.rstrip('/')}/{object_key.lstrip('/')}"
