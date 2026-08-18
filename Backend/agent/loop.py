
from agent.models.openai_connector import OpenAIModel
from agent.message import Message
from agent.agent import Agent










def build_chat (agent: Agent):


    return agent










def chat_loop(message):

    message += " You are an AI agent and your function is to respond to the chat Your functionality is very limited and when you feel like you arent well equiped to answer the users message call your job is to call the orchestrator agent. Use the wakeup_orchestrator function to hand off the task you can't reliably solve. "
    

    model = OpenAIModel("gpt-5-nano")
    agent = Agent(model=model)
    chat_agent = build_chat(agent)

    response = chat_agent.ask(message)

    data = response.json

    output = data["output"]

    for k in output:
        if k == "function_call":
            return orchestrator_loop()

    return response.output_text




def orchestrator_loop():
    return "Orchestrator Agent Reached"



























    