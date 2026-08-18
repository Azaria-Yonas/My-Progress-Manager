
from agent.models.openai_connector import OpenAIModel

from agent.message import Message

from agent.agent import Agent






def build_orchestrator (Agent, Model):
    pass 

def build_chat (agent: Agent):

    return agent

    

def build_summarizer (Agent, Model):
    pass




def chat_loop(message):
    model = OpenAIModel("gp")
    agent = Agent(model=model)
    chat_agent = build_chat(agent)

    return chat_agent.ask(message)



























    