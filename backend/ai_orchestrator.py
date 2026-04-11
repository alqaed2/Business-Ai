import os
from typing import List, Dict, Any
import anthropic

class BaseAgent:
    def __init__(self, name: str, role_prompt: str):
        self.name = name
        self.role_prompt = role_prompt
        self.client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

    def execute(self, task: str) -> str:
        response = self.client.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=1024,
            system=self.role_prompt,
            messages=[
                {"role": "user", "content": task}
            ]
        )
        return response.content[0].text

class MarketingAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Marketing Agent",
            role_prompt="You are a CMO-level Marketing Agent. Your goal is to generate high-converting marketing content, strategies, and analysis. Be creative, data-driven, and professional."
        )

class OperationsAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Operations Agent",
            role_prompt="You are a COO-level Operations Agent. Your goal is to optimize business processes, analyze operational data, and suggest efficiency improvements."
        )

class SalesAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Sales Agent",
            role_prompt="You are a Sales Agent focused on lead qualification and closing deals."
        )

class AIOrchestrator:
    def __init__(self):
        self.agents = {
            "marketing": MarketingAgent(),
            "operations": OperationsAgent(),
            "sales": SalesAgent()
        }

    def route_task(self, agent_id: str, task: str) -> str:
        agent = self.agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")
        return agent.execute(task)
