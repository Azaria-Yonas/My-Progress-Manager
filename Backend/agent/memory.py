from pathlib import Path
from history import ChatHistoryManager, AgentHistoryManager
import tiktoken
import json



class Memory:
    """The memory class is every piece of data that is avai"""
    def __init__(self, 
        agent_history: AgentHistoryManager, 
        chat_history: ChatHistoryManager,
        bootstrap = {}, 
        tools = {}, 
        user_data= {},
        **kwargs
    ):
        self.bootstrap = bootstrap
        self.chat_history = chat_history
        self.agent_history = agent_history
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

    def dump(self, 
        include_bootstrap = True, 
        include_chat_history =True, 
        include_tools = True,
        include_user_data = True,
        include_additional_resources = True 
    ):
        dump = {}

        if include_bootstrap == True:
            dump["Bootstrap"] = self.bootstrap

        if include_chat_history == True: 
            dump["Chat History"] = self.chat_history.history()

        if include_tools == True:

            dump["Tools"] = self.tools
        if include_user_data == True:
            dump["User Data"] = self.user_data

        if include_additional_resources == True:
            dump["Additional Resources"] = self.additional_resources

        return dump













































# class Memory:
#     """The memory class is every piece of data that is avai"""
#     def __init__(self, 
#         bootstrap = {}, 
#         history=  {}, 
#         tools = {}, 
#         user_data= {},
#         **kwargs
#     ):
#         self.bootstrap = bootstrap
#         self.chat_history = history
#         self.tools = tools
#         self.user_data = user_data
#         self.additional_resources = kwargs
        

#         self.token_count = self.count_tokens() 




#     def count_tokens(self, model="gpt-5-nano"):
#         """This function give a rough estimate of the number of tokens in memory"""
#         text = str(self.user_data) + str(self.bootstrap) + str(self.tools) + str(self.chat_history) + str(self.additional_resources) 
#         encoding = tiktoken.encoding_for_model(model)

#         self.token_count = len(encoding.encode(text))
#         return self.token_count

#     def dump(self, 
#         include_bootstrap = True, 
#         include_chat_history =True, 
#         include_tools = True,
#         include_user_data = True,
#         include_additional_resources = True 
#     ):
#         dump = {}

#         if include_bootstrap == True:
#             dump["Bootstrap"] = self.bootstrap

#         if include_chat_history == True: 
#             dump["Chat History"] = self.chat_history

#         if include_tools == True:

#             dump["Tools"] = self.tools
#         if include_user_data == True:
#             dump["User Data"] = self.user_data

#         if include_additional_resources == True:
#             dump["Additional Resources"] = self.additional_resources

#         return dump