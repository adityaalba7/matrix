from fastapi import APIRouter
from app.schemas import MindMapRequest, MindMapResponse
from app.services.mind_map_service import get_mind_map

router = APIRouter()

@router.post("/", response_model=MindMapResponse)
def mind_map(req: MindMapRequest):
    """
    Generate a node-edge concept mind map for any topic using Gemini.
    Returns nodes and edges ready for React Flow / D3 rendering.
    """
    return get_mind_map(req)
