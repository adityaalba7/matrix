from app.schemas import MindMapRequest, MindMapResponse, MindMapNode, MindMapEdge
from app.services.mind_map_builder import build_mind_map


def get_mind_map(req: MindMapRequest) -> MindMapResponse:
    graph = build_mind_map(req.topic)

    nodes = [MindMapNode(**n) for n in graph.get("nodes", [])]
    edges = [MindMapEdge(**e) for e in graph.get("edges", [])]

    return MindMapResponse(topic=req.topic, nodes=nodes, edges=edges)
