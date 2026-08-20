from pathlib import Path
import tiktoken
import json



class Memory:
    def __init__(self, 
        input = None,
        bootstrap = None, 
        history= None, 
        tools = None, 
        user_data= None,
        **kwargs
    ):
        self.bootstrap = bootstrap
        self.chat_history = history
        self.tools = tools
        self.user_data = user_data
        self.input = input
        self.additional_resources = kwargs
        

        self._token_count = None




    def token_count(self, model="gpt-5-nano"):
        """This function give a rough estimate of the number of tokens in memory"""
        text = str(self.user_data) + str(self.bootstrap) + str(self.tools) + str(self.chat_history) + str(self.additional_resources) 
        encoding = tiktoken.encoding_for_model(model)

        self._token_count = len(encoding.encode(text))
        return self._token_count
















