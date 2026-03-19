from flask import Flask, request
from supabase_client import new_client


supabase = new_client()


app = Flask(__name__)


@app.route("/", methods=["POST"])
def addnumber():
    data = request.json
    a = data["a"]
    b = data["b"]
    return {"result": a + b}



@app.route("/login", methods=["POST"])
def login():
    data = request.json

    response = supabase.auth.sign_in_with_password(
        {
            "email": data["email"],
            "password": data["password"],
        }
    )

    return response.model_dump()



if "__main__" == __name__:
    app.run(debug=True)
