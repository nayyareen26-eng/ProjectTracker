from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from app.config import settings
from app.utils.email_templates import password_set_email


conf = ConnectionConfig(
     MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=True,  
    MAIL_SSL_TLS=False,  
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_reset_password_email(
    to_email: str,
    first_name: str,
    token: str
):
    reset_link = f"http://localhost:3000/set-password?token={token}"

    html = password_set_email(first_name, reset_link)

    message = MessageSchema(
        subject="Set your password - Project Tracker",
        recipients=[to_email],
        body=html,
        subtype="html"
    )

    fm = FastMail(conf)
    await fm.send_message(message)
