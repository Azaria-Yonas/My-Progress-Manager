from openai import OpenAI
from config import OPENAI_KEY
from routes.agent import get_agent
import json

import requests




class OpenAIModel:
    def __init__(self, model = "gpt-5-nano", max_output_tokens = 500, reasoning = None):
        self.client = OpenAI(api_key=OPENAI_KEY)
        self.model = model
        self.reasoning = reasoning
        self.output = max_output_tokens
        self.last_response = None

    def ask(self, memory, message):  

        bootstrap = memory.get("Bootstrap")
        chat_history = memory.get("Chat History")
        user_data = memory.get("User Data")
        additional_resources = memory.get("Additional Resources")

        
        instructions = {}
        input = {}

        if bootstrap is not None:
            instructions["Bootsrap"] = bootstrap
        if chat_history is not None: 

            input["Chat_History"] = chat_history 

        if user_data is not None:
            instructions["User Data"] = user_data

        if additional_resources is not None:
            instructions["Additional Resources"] = additional_resources

        input["Lastest request"]= message 






        response = self.client.responses.create (
            model=self.model,
            instructions=json.dumps(instructions),
            tools=memory.get("Tools"),
            input= json.dumps(input, default=str)

        )

        self.last_response = response


        return response   




    def parse(self, responses=None):
        if responses is None:
            if self.last_response is None:
                return
            responses = self.last_response


        for response in responses.output:
            if response.type == "function_call":
                func_name = response.name
                attributes = json.loads(response.arguments)


    def advanced_parse(self, responses=None):
        if responses is None:
            if self.last_response is None:
                return
            responses = self.last_response

            for response in responses:
                pass 







































# Model Class with no SDK


# class OpenAIModel:
#     endpoint = "https://api.openai.com/v1/responses" 
#     header = {
#         "Authorization": f"Bearer {OPENAI_KEY}", 
#         "Content-Type": "application/json",
#     }

#     def __init__(self, model, max_output_tokens = 500, reasoning = None):
#         self.client = OpenAI(api_key=OPENAI_KEY)
#         self.model = model
#         self.reasoning = reasoning
#         self.output = max_output_tokens 












    
