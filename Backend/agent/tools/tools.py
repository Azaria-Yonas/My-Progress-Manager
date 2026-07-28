import json

TOOLS = "Backend/agent/tools/tools.json"

def get_tools():
    with open(TOOLS, "r") as f:
        return json.load(f)