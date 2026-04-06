"""
Mind Map Builder
----------------
Asks Gemini to produce a node-edge graph for a topic.
Returns nodes and edges that the frontend can render with React Flow / D3.
"""

import json
import re
from app.utils.llm_client import ask_llm

SYSTEM = """You are a knowledge graph expert. Respond with ONLY valid JSON — no markdown, no extra text."""

PROMPT_TEMPLATE = """Create a concept mind map for the topic: "{topic}".

Return a JSON object with two keys:
{{
  "nodes": [
    {{"id": "1", "label": "...", "type": "root"}},
    {{"id": "2", "label": "...", "type": "subtopic"}},
    {{"id": "3", "label": "...", "type": "leaf"}}
  ],
  "edges": [
    {{"source": "1", "target": "2", "label": "has"}},
    {{"source": "2", "target": "3", "label": "includes"}}
  ]
}}

Rules:
- Exactly 1 root node (the topic itself).
- 3–5 subtopic nodes (major sub-areas).
- 2–3 leaf nodes per subtopic (specific concepts).
- Total nodes: 10–20.
- Edge labels should be short relationship words (has, includes, requires, leads to).
"""


def build_mind_map(topic: str) -> dict:
    prompt = PROMPT_TEMPLATE.format(topic=topic)
    raw = ask_llm(prompt, system=SYSTEM, provider="groq")
    raw = re.sub(r"```json|```", "", raw).strip()

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Minimal fallback graph
        return {
            "nodes": [
                {"id": "1", "label": topic,     "type": "root"},
                {"id": "2", "label": "Core concepts", "type": "subtopic"},
                {"id": "3", "label": "Applications",  "type": "subtopic"},
            ],
            "edges": [
                {"source": "1", "target": "2", "label": "has"},
                {"source": "1", "target": "3", "label": "has"},
            ],
        }
