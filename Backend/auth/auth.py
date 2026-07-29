# auth/auth.py

from clients.supabase_client import new_client


class AuthError(Exception):
    pass


def authenticate_userid(request):
    supabase = new_client()

    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise AuthError("Missing Authorization header")

    parts = auth_header.split(" ")
    if len(parts) != 2 or parts[0] != "Bearer" or not parts[1]:
        raise AuthError("Malformed Authorization header")

    try:
        user = supabase.auth.get_user(parts[1])
    except Exception as e:
        raise AuthError(str(e))

    if not user or not user.user:
        raise AuthError("Invalid or expired token")

    return user.user.id
