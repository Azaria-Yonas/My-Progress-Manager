# auth/auth.py

from clients.supabase_client import new_client

def authenticate_userid(request):
    supabase = new_client()

    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None

    token = auth_header.split(" ")[1]

    user = supabase.auth.get_user(token)

    if not user or not user.user:
        return None

    return user.user.id