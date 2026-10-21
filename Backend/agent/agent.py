from pathlib import Path
from routes.agent import get_agent
import json

from agent.memory import Memory
from agent.models.openai_connector import OpenAIModel 

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

































    
