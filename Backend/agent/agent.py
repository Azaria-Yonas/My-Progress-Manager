from pathlib import Path
from routes.agent import get_agent
import json

from agent.memory import Memory
from agent.models.openai_connector import OpenAIModel 

from clients.psycopg_connect import psycopg_connect
from user import User





     




class Agent:
    
    def __init__(self, user, model: OpenAIModel, memory:  Memory, tool_registry = {} ):
        self.model = model
        self.memory = memory
        self.tool_registry = tool_registry
        self.user_info = user


    


    def ask(self, message):
        return self.model.ask(self.memory, message)
    

    def parse(self, response = None):
        return self.model.parse(responses=response)


    def build_message(self, dump_all = False):
        """This function constructs the agents prompt."""

        if dump_all is True:
            return self.memory.dump()

        return 
    


    def call_function(self, uuid, function_name, **kargs):
        """This function executes the agents tools"""
        function = self.tool_registry[function_name]

        if self.tool_registry["uuid"]:
            return function (uuid, **kargs)

        return function(**kargs) 

    def execute(self):
        """This funciton handles the parsed """


    def history(self):
        """Adds the output of the agentic calls either into the chat history or the agent history"""










chat = {"AGENT.md": None, "APP.md": None, "DETAILS.md": None, 
            "IMPORTANT.md":None, "PERSONALITY.md": None, "SCOPE.md": None, 
            "TOOLS.md": None, "USER.md": None}



def load_bootstrap(path, template):
    if not isinstance(path, Path):
        path = Path(path)

    assert path.is_dir()

    for i in template:
        if file := path / i: 
            with open(file, 'r') as f:
                template[i] = f.read()

    



    

    
    

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

    try:
        with psycopg_connect() as conn: 
            with conn.cursor() as curr:
                curr.execute( 
                    "SELECT agent_name, user_data FROM public.agent WHERE user_id = %s", 
                    (uuid,)
                ) 

                row = curr.fetchone()
                if row is None:
                    return {"User Data" : "No User Data"}

                return {"User Data" :  { 
                    "Agent's User Given Name" :row[0],
                    "User Prefrences" : row[1]
                    }
                }


            
    except:
        return {"User Data" : "No User Data"}









def create_agent(agent: Agent, memory: Memory, model: OpenAIModel, user: User, tools = None, bootstrap = None, user_data = None):

    if tools is not None: 

        memory.tools = tools

    if bootstrap is not None:   
        memory.bootstrap = bootstrap

    if user_data is not None:
        memory.user_data = user_data


    model = OpenAIModel()
    user = User()
    

    agent.memory = memory
    agent.model = model
    agent.user_info = user

    return agent





    

















    
