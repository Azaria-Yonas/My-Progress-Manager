from pathlib import Path
from routes.agent import get_agent
import json

from agent.memory import Memory
from agent.models.openai_connector import OpenAIModel 








def load_bootstrap(path):
    """This funciton recursively reads parses agent bootstap directories/files"""
    if not isinstance(path, Path):
        path = Path(path)


    bootstrap = {}

    if Path.is_file(path) and path.suffix == ".md":
        with open(path, 'r') as f:
            bootstrap[path.name] = f.read() 

    if Path.is_dir(path):
        files = sorted(path.rglob("*.md", case_sensitive=False))
        for i in files:
            with open(i, "r") as f:
                bootstrap[i.name] = f.read() 

    return bootstrap

    

def load_tools (path):
    """This function parses a json file that stores the tools
     and converts it into a python dictionary """
    if not isinstance(path, Path): 
        path = Path(path)
    if Path.is_file(path) and path.suffix == ".json":  
        with open(path, "r") as f:
            return json.load(f)
    else:
        return None




    
def load_user_data(uuid):
    response = get_agent(uuid) 

    if isinstance(response, tuple):
        response, status_code = response

        if status_code in [200, 206]: 

            data = response.get_json()

            return data[2]
        

    return None







class Agent:
    
    def __init__(self, model = OpenAIModel(), memory =  Memory()):
        self.model = model
        self.memory = memory



    def build_message(self, dump_all = False):
        """This function construct a message to send.

        Return dict()

        Example:

            message = {
                "Bootstrap" : {},
                "Chat History": {},
                ...

            
            }
        
        
        """

        if dump_all is True:
            return self.memory.dump()

        return 
    





    # def ask(self, message):
    #     if self.model:
    #         return self.model.ask(message) 
    #     return "Error"











def create_agent(agent: Agent, memory: Memory, model: OpenAIModel, tools = None, bootstrap = None, user_data = None):

    if tools is not None: 

        memory.tools = tools

    if bootstrap is not None:   
        memory.bootstrap = bootstrap

    if user_data is not None:
        memory.user_data = user_data


    model = OpenAIModel("gpt-5-nano")
    

    agent.memory = memory
    agent.model = model

    return agent





    

















    
