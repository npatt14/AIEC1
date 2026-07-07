from __future__ import annotations

from typing import Literal

from langchain_core.messages import AIMessage, HumanMessage
from langgraph.graph import END, START, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode, tools_condition
from pydantic import BaseModel, Field

from app.models import get_chat_model
from app.tools import get_tool_belt

SYSTEM_PROMPT = (
    "You are a helpful assistant specialized in feline (cat) health. "
    "Use the retrieve_information tool for cat-health questions, web search for "
    "current information, and Arxiv for research papers. Cite tool results when "
    "they inform your answer."
)

MAX_HELPFULNESS_LOOPS = 3

tools = get_tool_belt()
model = get_chat_model().bind_tools(tools)
judge_model = get_chat_model()


class HelpfulnessGrade(BaseModel):
    helpful: bool = Field(
        description="Whether the assistant's answer helpfully addresses the user's question"
    )


class HelpfulnessState(MessagesState):
    is_helpful: bool


def call_model(state: HelpfulnessState) -> dict:
    messages = [{"role": "system", "content": SYSTEM_PROMPT}, *state["messages"]]
    response = model.invoke(messages)
    return {"messages": [response]}


def grade_helpfulness(state: HelpfulnessState) -> dict:
    last_human = next(
        m for m in reversed(state["messages"]) if isinstance(m, HumanMessage)
    )
    last_ai = state["messages"][-1]

    grade = judge_model.with_structured_output(HelpfulnessGrade).invoke(
        [
            {
                "role": "system",
                "content": "Judge whether the assistant's answer is a helpful, "
                "complete response to the user's question. Be strict.",
            },
            {
                "role": "human",
                "content": f"Question: {last_human.content}\n\nAnswer: {last_ai.content}",
            },
        ]
    )
    return {"is_helpful": grade.helpful}


def route_after_grading(state: HelpfulnessState) -> Literal["agent", "__end__"]:
    loop_count = sum(1 for m in state["messages"] if isinstance(m, AIMessage))
    if state["is_helpful"] or loop_count >= MAX_HELPFULNESS_LOOPS:
        return "__end__"
    return "agent"


workflow = StateGraph(HelpfulnessState)
workflow.add_node("agent", call_model)
workflow.add_node("tools", ToolNode(tools))
workflow.add_node("helpfulness", grade_helpfulness)

workflow.add_edge(START, "agent")
workflow.add_conditional_edges(
    "agent", tools_condition, {"tools": "tools", "__end__": "helpfulness"}
)
workflow.add_edge("tools", "agent")
workflow.add_conditional_edges(
    "helpfulness", route_after_grading, {"agent": "agent", "__end__": END}
)

graph = workflow.compile()
