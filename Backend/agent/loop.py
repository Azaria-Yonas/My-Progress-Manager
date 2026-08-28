from agent.models.openai_connector import OpenAIModel
from agent.memory import Memory
from agent.agent import Agent, load_user_data, load_tools, load_bootstrap, create_agent
from agent.tools.chat.tools import call_function
from agent.message_queue import MessageQueue
import json





def chat_loop(uuid, message_queue: MessageQueue, ws = None):
    tools = load_tools("agent/tools/chat/tools_chat.json")
    bootstrap = load_bootstrap("agent/agent_bootstrap/chat/")
    user_data = load_user_data(uuid)



    agent0 = Agent()
    memo = Memory(tools=tools, bootstrap=bootstrap, user_data=user_data, history=[])
    mod = OpenAIModel()


    agent = create_agent(agent0, memo, mod)

    message = message_queue.get_messages()

    x= 0
    while x<10:

        memory_dump = agent.build_message(dump_all=True)

        
        response = agent.model.ask(memory_dump, message)


        for resp in response.output:
            if resp.type == "function_call":
                func_name = resp.name
                attributes = json.loads(resp.arguments)
                results = call_function(func_name, uuid, **attributes)
                agent.memory.chat_history.append({
                    "Tool Call": func_name,
                    "Arguments": attributes,
                    "Result": results
                })
                
            if resp.type == "message":
                print(response.output_text)
                if ws is not None:
                    ws.send(response.output_text)
                return

        


    



    # #     print("End of Agentic Loop")
    # #     print(""*4)






















    

        x += 1






if __name__ == "__main__":

    mq = MessageQueue(5)

    mq.add_message("Hey I need to complete my Math assignment by Today before midnight. Can you create a reminder for me")

    mq.add_message("Hey how I have been doing these past few days.")


    chat_loop("3f027e9f-2437-4f5e-90ed-c6423ffb4186", mq)


















