from pathlib import Path
import tiktoken
import json



class Message():
    def __init__(self, 
        input = None,
        bootstrap = None, 
        history= None, 
        tools = None, 
        data= None,
        model = None
    ):
        self._bootstrap = bootstrap
        self._chat_history = history
        self._tools = tools
        self._data = data
        self._token_count = None
        self._model = model
        self._input = input


    # @property
    # def bootstrap(self):
    #     return self._bootstrap

    # @bootstrap.setter
    # def bootstrap(self, path: Path):
    #     path = Path(path)

    #     text = {}

    #     if Path.is_file(path) and path.suffix == ".md":
    #         with open(path, 'r') as f:
    #             text[path.name] = f.read() 

    #     if Path.is_dir(path):
    #         files = list(path.rglob("*.md"))
    #         for i in files:
    #             with open(i, "r") as f:
    #                 text[path.name] = f.read() 

    #     self._bootstrap = text




    # @property
    # def chat_history(self):
    #     return self._chat_history

    # @property
    # def tools (self):
    #     return self._tools

    # @tools.setter
    # def tools(self, tools):
    #     """Takes a JSON file full of task with all the neccessary 
    #     tool calling assistances"""

    #     with open(tools, "r") as f:
    #         self._tools = json.load(f)


    


    # @property
    # def data(self):
    #     return self._data

    # @data.setter
    # def data(self, path: Path):
    #     path = Path(path)

    #     text = {}

    #     if Path.is_file(path) and path.suffix == ".md":
    #         with open(path, 'r') as f:
    #             text[path.name] = f.read() 

    #     if Path.is_dir(path):
    #         files = list(path.rglob("*.md"))
    #         for i in files:
    #             with open(i, "r") as f:
    #                 text[path.name] = f.read() 

    #     self._data = text



    def token_count(self, model="gpt-5-nano"):
        """This function give a rough estimate of the token count"""
        text = str(self._data) + str(self._bootstrap) + str(self._tools) + str(self._chat_history)
        encoding = tiktoken.encoding_for_model(model)

        self._token_count = len(encoding.encode(text))
        return self._token_count
     












