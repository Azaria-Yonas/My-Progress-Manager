# routes/signup.py
from flask import request, jsonify
from clients.supabase_client import new_client



def signup():

    supabase = new_client()
    data = request.json
    try:
        response = supabase.auth.sign_up(
            {
                "email": data["email"],
                "password": data["password"],
                "options": {
                    "data": {
                        "display_name": data["firstName"] + " " + data["lastName"],
                        "first_name": data["firstName"],
                        "last_name" : data["lastName"]
                        }},
            }
        )
        if not response.user or not response.session:
            return jsonify({"error": "Error, Try Again"}), 400
        
        user = response.user
        session = response.session

        return jsonify({
            "user": {
                "id": user.id,
                "email": user.email,
                "firstName": user.user_metadata.get("first_name"),
                "lastName": user.user_metadata.get("last_name"),
            },
            "access_token": session.access_token
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


