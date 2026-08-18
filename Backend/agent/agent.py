

class Agent:
    
    def __init__(self, model, bootstrap = None, tools = None):
        self._OpenAIModel = model
        self._bootstrap = bootstrap
        self._tools = tools

    def ask(self, message):

       return self._OpenAIModel.ask(message) 













    
