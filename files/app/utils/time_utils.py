from typing import List, Dict, Tuple
from app.models import QuizSession

def score_by_hour(sessions: List[QuizSession]) -> Dict[int, float]:
    """Calculate average score for each hour of the day."""
    hour_scores = {}
    hour_counts = {}
    for s in sessions:
        if s.taken_at:
            h = s.taken_at.hour
            hour_scores[h] = hour_scores.get(h, 0.0) + s.score
            hour_counts[h] = hour_counts.get(h, 0) + 1
    
    return {h: hour_scores[h]/hour_counts[h] for h in hour_scores}

def best_hour_range(hour_scores: Dict[int, float], window_size: int = 2) -> Tuple[int, int]:
    """Find the best consecutive hours window with maximum average score."""
    if not hour_scores:
        return 20, 22
    
    best_start = 0
    max_avg = -1.0
    
    for h in range(24):
        window_sum = 0
        count = 0
        for i in range(window_size):
            curr_h = (h + i) % 24
            if curr_h in hour_scores:
                window_sum += hour_scores[curr_h]
                count += 1
        
        if window_size > 0:
            avg = window_sum / window_size
            if avg > max_avg:
                max_avg = avg
                best_start = h
                
    return best_start, (best_start + window_size) % 24

def format_hour(hour: int) -> str:
    """Format hour (0-23) as AM/PM string."""
    if hour == 0:
        return "12 AM"
    elif hour < 12:
        return f"{hour} AM"
    elif hour == 12:
        return "12 PM"
    else:
        return f"{hour - 12} PM"
