
from anthropic import Anthropic
from config import ANTHROPIC_KEY
from routes.agent import get_agent
from collections import deque
import json

import requests



class AnthropicModel:
    """I will primarily be using the anthropic model for tasks requiring lots of resoning"""
    def __init__(self, model = "claude-opus-5", max_output_tokens = 500, reasoning = None, responses = deque()):
        self.client = Anthropic(api_key=ANTHROPIC_KEY)
        self.model = model
        self.reasoning = reasoning
        self.output = max_output_tokens
        self.responses = responses

    def convert_tools(self, tools):
        if not tools:
            return []

        converted = []
        for tool in tools:
            converted.append({
                "name": tool.get("name"),
                "description": tool.get("description"),
                "input_schema": tool.get("parameters", {"type": "object", "properties": {}}),
            })

        return converted

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






        response = self.client.messages.create (
            model=self.model,
            max_tokens=self.output,
            system=json.dumps(instructions),
            tools=self.convert_tools(memory.get("Tools")),
            messages=[{"role": "user", "content": json.dumps(input, default=str)}]

        )

        self.responses.extend(response.content)




    def parse(self, responses=None):
        if responses is None:
            if self.responses.count == 0:
                return
            responses = self.responses


        for response in list(responses):
            if response.type == "tool_use":
                func_name = response.name
                attributes = response.input






