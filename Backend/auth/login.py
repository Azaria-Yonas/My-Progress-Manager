from flask import request, jsonify
from clients.supabase_client import new_client


def login():

    supabase = new_client()
    data = request.json
    try:
        response = supabase.auth.sign_in_with_password(
            {
                "email": data["email"],
                "password": data["password"],
            }
        )
        
        if not response.user or not response.session:
            return jsonify({"error": "Invalid credentials"}), 401

        user = response.user
        session = response.session

        return jsonify({
            "user": {
                "id": user.id,
                "email": user.email,
                "firstName": user.user_metadata.get("firstName"),
                "lastName": user.user_metadata.get("lastName"),
            },
            "access_token": session.access_token
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
