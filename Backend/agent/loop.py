from agent.models.openai_connector import OpenAIModel
from agent.memory import Memory
from agent.agent import Agent, load_user_data, load_tools, load_bootstrap, create_agent
from agent.tools.chat.tools import call_function






def chat_loop(uuid, message):
    tools = load_tools("agent/tools/tools_chat.json")
    # print(str(tools))
    # print("\n"*5)
    bootstrap = load_bootstrap("agent/agent_bootstrap/chat/")
    # print(str(bootstrap))
    # print("\n"*5)

    try:
        user_data = load_user_data(uuid)
        # print(user_data)
    except:
        user_data = None
        # print("No User Data")  # Replace this with logging 




    agent0 = Agent()
    memo = Memory(tools=tools, bootstrap=bootstrap, user_data=user_data)
    mod = OpenAIModel()


    agent = create_agent(agent0, memo, mod)

    while (True):

        memory_dump = agent.build_message(dump_all=True)

        agent.memory.count_tokens()

        print(agent.memory.token_count)

    #     response = agent.model.ask(memory_dump, message)


    #     for i in response.output:
    #         if i.type == "function_call":
    #             print("Function call")
    #         if i.type == "message":
    #             print(response.output_text)
    #             break

        


    



    # #     print("End of Agentic Loop")
    # #     print(""*4)






















    

        break









chat_loop("3f027e9f-2437-4f5e-90ed-c6423ffb4186", "Hey how is your day")


















