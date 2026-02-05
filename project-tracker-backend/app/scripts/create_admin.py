from app.database.database import SessionLocal
from app.models.user import User
from app.utils.password_utils import hash_password

db = SessionLocal()

admin = User(
    user_name="Nayyareen",
    email_id="nayyareen.26@gmail.com",
    password=hash_password("nayyareen"),
    job_profile="ADMIN",
    is_active=True
)

db.add(admin)
db.commit()
db.close()

print(" Admin created successfully")
