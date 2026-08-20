from pathlib import Path
from routes.agent import get_agent
import json

from memory import Memory
from models.openai_connector import OpenAIModel 








def load_bootstrap(path):
    if not isinstance(path, Path):
        path = Path(path)


    text = {}

    if Path.is_file(path) and path.suffix == ".md":
        with open(path, 'r') as f:
            text[path.name] = f.read() 

    if Path.is_dir(path):
        files = list(path.rglob("*.md"))
        for i in files:
            with open(i, "r") as f:
                text[path.name] = f.read() 

        return text

    

def load_tools (path):
    path = Path(path)
    """Converts a json file into a python dictionary"""
    if Path.is_file(path) and Path.suffix == ".json":
        with open(path, "r") as f:
            return json.load(f)
    else:
        return "File path Error"




    
def load_user_data(uuid):
    response = get_agent(uuid) 

    if isinstance(response, tuple):
        response, status_code = response

        if status_code in [200, 204, 206]: 
            return None

    data = response.get_json()

    return data[2]







class Agent:
    
    def __init__(self, model= None, memory= None):
        self.model = model
        self.memory = memory


    def ask(self, message):
        if self.model:
            return self.model.ask(message) 
        return "Error"











def create_agent(agent: Agent, memory: Memory, model: OpenAIModel, tools, bootstrap, user_data):

    memory.tools = tools
    memory.bootstrap = bootstrap
    memory.user_data = user_data


    model = OpenAIModel("gpt-5-nano")
    

    agent.memory = memory
    agent.model = model

    return agent





    

















    
