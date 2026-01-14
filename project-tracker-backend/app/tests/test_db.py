from app.database.database import engine

try:
    connection = engine.connect()
    print("Database connected successfully")
    connection.close()
except Exception as e:
    print(" DB connection failed:", e)

