


class Agent:
    
    def __init__(self, model):
        self._OpenAIModel = model

    def ask(self, message):   # this should belong to the model


        response = self._OpenAIModel.client.responses.create (
            model=self._OpenAIModel.model,
            tools=message.tools,
            input=message.chat_history
        )
        return response.output_text    






