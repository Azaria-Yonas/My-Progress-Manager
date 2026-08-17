from openai import OpenAI
from config import OPENAI_KEY
from routes.agent import get_agent



class OpenAIModel:
    def __init__(self):
        self._client = OpenAI(api_key=OPENAI_KEY)

    def build_message(self, 
        bootstrap = None, 
        history= None, 
        tools = None, 
        resources= None,
        model = None
    ):

        pass
        








class ChatModel(OpenAIModel):
    """This Model is Specialized in Handling certain tasks and primarily the Chat interface"""

    def __init__ (self):
        self._model = "gpt-5-nano"

    # def user_data(self, user_id):
    #     data = get_agent(user_id)
    #     return data[2]
        
        



    



class BaseModel(OpenAIModel): 
    """This is the primary model, capable of reasoning"""   

    def __init__ (self):
        self._model = "gpt-5-mini"



class SummaryModel(OpenAIModel):
    """The summary model exists exclusively to reduce costs"""


    def __init__ (self):
        self._model = "gpt-5-nano"








    
