from supabase import create_client
from config import SUPABASE_KEY, SUPABASE_URL, SUPABASE_ADMIN_KEY



def new_client():
    if not SUPABASE_KEY:
        raise Exception("Key is missing!!!")
    if not SUPABASE_URL:
        raise Exception("URL is missing!!!")

    return create_client(SUPABASE_URL, SUPABASE_KEY)

def admin_client():
    if not SUPABASE_ADMIN_KEY:
        raise Exception("Key is missing!!!")
    if not SUPABASE_URL:
        raise Exception("URL is missing!!!")

    return create_client(SUPABASE_URL, SUPABASE_ADMIN_KEY)  






