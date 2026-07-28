from agent.agent import Agent
from agent.tools.tools import get_tools
from agent.models.openai_connector import OpenAIModel

TEST_PROMPT = "this is a system check send me a list of all the tools that are available to you"

def loop():
    tools = get_tools()
    model = OpenAIModel("gpt-5.6", tools=tools)

    

    agent = Agent(model=model)

    while True:


        print(agent.send_message(TEST_PROMPT))

        break




    
    