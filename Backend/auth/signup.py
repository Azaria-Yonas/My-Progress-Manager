from flask import request
from supabase import Client



def signup(supabase: Client):

    data = request.json

    response = supabase.auth.sign_up(
        {
            "email": data["email"],
            "password": data["password"],
        }
    )
    return response


