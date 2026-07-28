


class Agent:
    def __init__ (self, model):
        self._model = model

    def send_message(self, message):
        return self._model.ask(message)
