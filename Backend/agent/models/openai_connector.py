from openai import OpenAI
from config import OPENAI_KEY
from routes.agent import get_agent





class OpenAIModel:
    def __init__(self, model):
        self._client = OpenAI(api_key=OPENAI_KEY)
        self._model = model

    def ask(self, message):  


        response = self._client.responses.create (
            model=self._model,
            # tools=message.tools,
            # conversation=message.chat_history,
            input=message


        )
        return response.output_text  













# class OpenAIModel:
#     def __init__(self):
#         self._client = OpenAI(api_key=OPENAI_KEY)
#         self._model = None

#     @property
#     def client(self):
#         return self._client

#     @property
#     def model(self):
#         return self._model

#     def ask(self, message):   # this should belong to the model


#         response = self._client.responses.create (
#             model=self._model,
#             tools=message.tools,
#             input=message.chat_history
#         )
#         return response.output_text  






# class ChatModel(OpenAIModel):
#     """This Model is Specialized in Handling certain tasks and primarily the Chat interface"""

#     def __init__ (self):
#         super().__init__()
#         self._model = "gpt-5-nano"

#     # def user_data(self, user_id):
#     #     data = get_agent(user_id)
#     #     return data[2]
        
        


# class BaseModel(OpenAIModel): 
#     """This is the primary model, capable of reasoning"""   

#     def __init__ (self):
#         super().__init__()
#         self._model = "gpt-5-mini"



# class SummaryModel(OpenAIModel):
#     """The summary model exists exclusively to reduce costs"""

#     def __init__ (self):
#         super().__init__()
#         self._model = "gpt-5-nano"








    
