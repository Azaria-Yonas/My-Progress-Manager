import json
import os

TOOLS = os.path.join(os.path.dirname(__file__), "tools.json")

def get_tools():
    with open(TOOLS, "r") as f:
        return json.load(f)