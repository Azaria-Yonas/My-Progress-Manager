from flask import Flask, request



app = Flask(__name__)


@app.route("/", methods=["POST"])
def addnumber():
    data = request.json
    a = data["a"]
    b = data["b"]
    return {"result": a + b}


if "__main__" == __name__:
    app.run(debug=True)
