import json




def get_tools(path):
    with open(path, "r") as f:
        return json.load(f)




