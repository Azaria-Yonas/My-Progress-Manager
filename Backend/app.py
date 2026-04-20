# app.py
from flask import Flask, request, jsonify
from auth.auth import authenticate_userid
from routes.login import login
from routes.signup import signup
from routes.tasks import fecth_tasks, create_task, update_task, delete_task, complete_task
from routes.streaks import fecth_streaks




 
app = Flask(__name__)

@app.route("/login", methods=["POST"])              # Login 
def login_route():
    return login()

@app.route("/sigup", methods=["POST"])              # SignUp
def signup_route_route():
    return signup()


@app.route("/tasks", methods = ["GET"])             # Fetch Tasks
def ftasks():
    try:
        id = authenticate_userid(request)
        return fecth_tasks(id)
    except Exception as e:
        return str(e), 400
    
@app.route("/tasks", methods = ["POST"])            # Create Tasks
def ctasks():
    try:
        data = request.json
        title = data["title"]
        description = data["description"]
        color = data["color"]
        created_at = data["created_at"]
        due_date = data["due_date"]
        id = authenticate_userid(request)
        return create_task(id, title, description, color, created_at, due_date)
    except Exception as e:
        return str(e), 400

@app.route("/task", methods=["PUT"])
def utasks():
    return jsonify({"Not Yet Implemented"})
 





@app.route("/streaks", methods = ["GET"])           # Fetch Streaks
def fstreaks():
    try:
        id = authenticate_userid(request)
        return fecth_streaks(id)
    except Exception as e:
        return str(e), 400






@app.route("/")
def home():
    return "Backend is running"


if __name__ == "__main__":
    app.run(debug=True)
