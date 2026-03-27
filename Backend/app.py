from flask import Flask, request
from clients.supabase_client import new_client      # Not Needed
from auth.login import login
from auth.signup import signup







 
app = Flask(__name__)

@app.route("/login", methods=["POST"])              # Login 
def login_route():
    return login()


@app.route("/sigup", methods=["POST"])              # SignUp
def signup_route_route():
    return signup()









@app.route("/")
def home():
    return "Backend is running"


if "__main__" == __name__:
    app.run(debug=True)
