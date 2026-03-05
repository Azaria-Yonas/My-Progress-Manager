import os
from supabase import create_client, Client


URL = os.getenv("supabaseurl")
ANON_KEY= os.getenv("supabasekey")


def create_Client():
    if URL and ANON_KEY is not None:
        supabase: Client = create_client(URL, ANON_KEY)
    else:
        raise Exception("Connection Unsuccessfull: API Key or URL Missing" )
    return supabase



supabase = create_Client()


def login(supabase: Client):
    supabase.auth.sign_in_with_password
