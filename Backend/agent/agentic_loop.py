# from agent.agent import Agent
# from agent.tools.tools import get_tools
# from agent.models.openai_connector import OpenAIModel



# TEST_PROMPT = "this is a system check send me a list of all the tools that are available to you. The next thing I want you to do is excute the create new class tool"

# def loop():
#     tools = get_tools()
#     model = OpenAIModel("gpt-5.6", tools=tools)

    

#     agent = Agent(model=model)

#     while True:


#         print(agent.send_message(TEST_PROMPT))

#         break


# loop()



from agent.agent import Agent
from agent.tools.tools import get_tools
from agent.models.openai_connector import OpenAIModel


TEST_PROMPT = "this is a system check send me a list of all the tools that are available to you. The next thing I want you to do is excute the create new task tool. Just a random task no need for questions"


def pretty_print(obj, indent=0):
    pad = "  " * indent

    if hasattr(obj, "__dict__") or hasattr(obj, "__fields__") or hasattr(obj, "model_fields"):
        fields = getattr(obj, "model_fields", None) or getattr(obj, "__dict__", None)
        if fields is None:
            fields = {k: getattr(obj, k) for k in dir(obj) if not k.startswith("_")}
        print(f"{pad}{type(obj).__name__}")
        for key in fields:
            value = getattr(obj, key, None)
            if isinstance(value, (list, tuple)):
                print(f"{pad}  {key}: [")
                for item in value:
                    pretty_print(item, indent + 2)
                print(f"{pad}  ]")
            elif hasattr(value, "__dict__") or hasattr(value, "model_fields"):
                print(f"{pad}  {key}:")
                pretty_print(value, indent + 2)
            else:
                print(f"{pad}  {key}: {value!r}")
        return

    if isinstance(obj, dict):
        print(f"{pad}{{")
        for k, v in obj.items():
            print(f"{pad}  {k}: {v!r}")
        print(f"{pad}}}")
        return

    print(f"{pad}{obj!r}")


def loop():
    tools = get_tools()
    model = OpenAIModel("gpt-5.6", tools=tools)

    agent = Agent(model=model)

    while True:
        response = agent.send_message(TEST_PROMPT)
        pretty_print(response)
        break


loop()
    
    