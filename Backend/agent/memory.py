from pathlib import Path
import tiktoken
import json



class Memory:
    def __init__(self, 
        bootstrap = "", 
        history=  {}, 
        tools = {}, 
        user_data= {},
        **kwargs
    ):
        self.bootstrap = bootstrap
        self.chat_history = history
        self.tools = tools
        self.user_data = user_data
        self.additional_resources = kwargs
        

        self.token_count = self.count_tokens() 




    def count_tokens(self, model="gpt-5-nano"):
        """This function give a rough estimate of the number of tokens in memory"""
        text = str(self.user_data) + str(self.bootstrap) + str(self.tools) + str(self.chat_history) + str(self.additional_resources) 
        encoding = tiktoken.encoding_for_model(model)

        self.token_count = len(encoding.encode(text))
        return self.token_count
















