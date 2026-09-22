import json
import time
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel


class Step(BaseModel):
    id: str
    name: str
    required_objects: List[str]
    order: int


class Routine(BaseModel):
    id: str
    name: str
    steps: List[Step]


class TransitionStatus(str, Enum):
    ADVANCED = "advanced"
    COMPLETED = "completed"
    NO_CHANGE = "no_change"


class StepTransition(BaseModel):
    status: TransitionStatus
    previous_step: Optional[Step] = None
    current_step: Optional[Step] = None


class TaskStateEngine:
    def __init__(self):
        self.routine: Optional[Routine] = None
        self.current_step_index: int = 0
        self.last_progress_time: float = time.time()

    def load_routine(self, routine_json_path: str):
        with open(routine_json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        self.routine = Routine(**data)
        # Sort steps by order to ensure chronological progression
        self.routine.steps.sort(key=lambda s: s.order)
        self.current_step_index = 0
        self.last_progress_time = time.time()

    def current_step(self) -> Optional[Step]:
        """Returns the current step of the routine, or None if completed/not loaded."""
        if not self.routine or self.current_step_index >= len(self.routine.steps):
            return None
        return self.routine.steps[self.current_step_index]

    def update(self, detected_objects: List[str]) -> StepTransition:
        """
        Compares detected objects against the current step's required_objects.
        If satisfied, advances to the next step and returns a transition event.
        Otherwise returns a 'no_change' transition.
        """
        step = self.current_step()

        # If routine is already completed or not loaded
        if not step:
            return StepTransition(status=TransitionStatus.NO_CHANGE)

        detected_set = set(detected_objects)
        required_set = set(step.required_objects)

        if required_set.issubset(detected_set):
            # Advance to the next step
            previous_step = step
            self.current_step_index += 1
            self.last_progress_time = time.time()
            next_step = self.current_step()

            if next_step:
                return StepTransition(
                    status=TransitionStatus.ADVANCED,
                    previous_step=previous_step,
                    current_step=next_step,
                )
            else:
                return StepTransition(
                    status=TransitionStatus.COMPLETED,
                    previous_step=previous_step,
                    current_step=None,
                )

        return StepTransition(status=TransitionStatus.NO_CHANGE, current_step=step)

    def time_since_last_progress(self) -> float:
        """Seconds since the last successful step transition."""
        return time.time() - self.last_progress_time
