
from agent.models.openai_connector import ChatModel, BaseModel, SummaryModel

from agent.message import Message

from agent.agent import Agent


orchestrator = Agent(BaseModel)

summarizer = Agent(SummaryModel)

chat = Agent(ChatModel)
BOOTSTRAP = "agent/agent_bootstrap/chat"




def chat_loop(chat_history):

    message = Message(bootstrap=BOOTSTRAP, history=chat_history)

    return chat.ask(Message)


    





def orchestrator_loop():
    print("orchestrator agent activated")
    