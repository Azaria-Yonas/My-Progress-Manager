# config.py
import os
from dotenv import load_dotenv

load_dotenv()


# Supabase/Psycopg Config
DB_HOST= os.getenv("DB_HOST")
DB_NAME= os.getenv("DB_NAME")
DB_USER=os.getenv("DB_USER")
DB_PASSWORD= os.getenv("DB_PASSWORD")
DB_PORT= os.getenv("DB_PORT")


# Supabase API config
SUPABASE_URL= os.getenv("SUPABASE_URL")
SUPABASE_KEY= os.getenv("SUPABASE_KEY")