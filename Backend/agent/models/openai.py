from openai import OpenAI
import os

from config import OPENAI_KEY

class OpenAIModel:
    def __init__(self, api_key, model):
        self.client = OpenAI(api_key=os.getenv("OPENAI_KEY"))
        self._model = model
        
    @property
    def model(self):
        return self._model

    @model.setter
    def model(self, value):
        self._model = value

    def ask(self, prompt):
        response = self.client.responses.create(
            model=self._model,
            input=prompt
        )
        return response.output_text       

        

        