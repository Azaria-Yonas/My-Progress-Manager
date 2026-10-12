from google import genai
from google.genai import types
from config import GEMINI_KEY
from routes.agent import get_agent
from collections import deque
import json

import requests



class GeminiModel:
    def __init__(self, model = "gemini-2.5-flash", max_output_tokens = 500, reasoning = None, responses = deque()):

        self.client = genai.Client(api_key=GEMINI_KEY)
        self.model = model
        self.reasoning = reasoning
        self.output = max_output_tokens
        self.responses = responses






    def clean_schema(self, schema):
        if not isinstance(schema, dict):
            return schema

        cleaned = {}
        for key, value in schema.items():
            if key in ("additionalProperties", "strict"):
                continue
            if key == "properties" and isinstance(value, dict):
                cleaned[key] = {name: self.clean_schema(sub) for name, sub in value.items()}
            elif key == "items":
                cleaned[key] = self.clean_schema(value)
            else:
                cleaned[key] = value

        return cleaned

    def convert_tools(self, tools):
        if not tools:
            return None

        declarations = []
        for tool in tools:
            declarations.append({
                "name": tool.get("name"),
                "description": tool.get("description"),
                "parameters": self.clean_schema(tool.get("parameters", {"type": "object", "properties": {}})),
            })

        return [types.Tool(function_declarations=declarations)]

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






        response = self.client.models.generate_content (
            model=self.model,
            contents=json.dumps(input, default=str),
            config=types.GenerateContentConfig(
                system_instruction=json.dumps(instructions),
                max_output_tokens=self.output,
                tools=self.convert_tools(memory.get("Tools"))
            )

        )

        self.responses.extend(response.candidates[0].content.parts)




    def parse(self, responses=None):
        if responses is None:
            if self.responses.count == 0:
                return
            responses = self.responses


        for response in list(responses):
            if response.function_call is not None:
                func_name = response.function_call.name
                attributes = dict(response.function_call.args)






























