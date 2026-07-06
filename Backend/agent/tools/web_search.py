from tavily import TavilyClient
from config import TAVILY_KEY





def websearch(prompt: str):
    client = TavilyClient(api_key=TAVILY_KEY)
    response = client.search(query=prompt)
    return response["results"][0]["content"]