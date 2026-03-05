from flask import request
from supabase import Client



def login(supabase: Client):

    data = request.json

    response = supabase.auth.sign_in_with_password(
        {
            "email": data["email"],
            "password": data["password"],
        }
    )
    return response
