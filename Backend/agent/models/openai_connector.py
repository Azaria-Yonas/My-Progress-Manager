from openai import OpenAI

from config import OPENAI_KEY

class OpenAIModel:
    def __init__(self, model, tools):
        self.client = OpenAI(api_key=OPENAI_KEY)
        self._model = model
        self._tools = tools
        
    @property
    def model(self):
        return self._model

    @model.setter
    def model(self, value):
        self._model = value

    @property
    def tools(self):
        return self._tools

    @model.setter
    def model(self, tools):
        self._tools = tools

    def ask(self, prompt):
        response = self.client.responses.create(
            model=self._model,
            tools=self._tools,
            input=prompt
        )
        return response      


# from agent.tools.tools import get_tools



# agent = OpenAIModel("gpt-5.6", tools=get_tools())

# print(agent.ask("this is a system check send me a list of all the tools that are available to you"))

        

        