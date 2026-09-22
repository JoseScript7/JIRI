import unittest
import json
import os
import time
from app.task_engine.state_machine import TaskStateEngine, TransitionStatus


class TestTaskStateEngine(unittest.TestCase):
    def setUp(self):
        # Create a mock routine JSON for testing
        self.test_json_path = "test_routine.json"
        routine_data = {
            "id": "test_1",
            "name": "Test Routine",
            "steps": [
                {
                    "id": "s1",
                    "name": "step 1",
                    "required_objects": ["apple"],
                    "order": 1,
                },
                {
                    "id": "s2",
                    "name": "step 2",
                    "required_objects": ["banana", "apple"],
                    "order": 2,
                },
            ],
        }
        with open(self.test_json_path, "w") as f:
            json.dump(routine_data, f)

        self.engine = TaskStateEngine()
        self.engine.load_routine(self.test_json_path)

    def tearDown(self):
        if os.path.exists(self.test_json_path):
            os.remove(self.test_json_path)

    def test_load_routine(self):
        self.assertEqual(self.engine.routine.name, "Test Routine")
        self.assertEqual(self.engine.current_step().name, "step 1")

    def test_no_change(self):
        # No matching objects
        transition = self.engine.update(["orange"])
        self.assertEqual(transition.status, TransitionStatus.NO_CHANGE)
        self.assertEqual(self.engine.current_step().name, "step 1")

        # Partial matching objects
        transition_partial = self.engine.update(["banana"])  # Step 1 requires 'apple'
        self.assertEqual(transition_partial.status, TransitionStatus.NO_CHANGE)
        self.assertEqual(self.engine.current_step().name, "step 1")

    def test_normal_progression(self):
        # Advance step 1
        transition1 = self.engine.update(["apple"])
        self.assertEqual(transition1.status, TransitionStatus.ADVANCED)
        self.assertEqual(transition1.previous_step.name, "step 1")
        self.assertEqual(transition1.current_step.name, "step 2")
        self.assertEqual(self.engine.current_step().name, "step 2")

        # Advance step 2
        transition2 = self.engine.update(["banana", "apple"])
        self.assertEqual(transition2.status, TransitionStatus.COMPLETED)
        self.assertEqual(transition2.previous_step.name, "step 2")
        self.assertIsNone(transition2.current_step)
        self.assertIsNone(self.engine.current_step())

        # Calling update after completion
        transition3 = self.engine.update(["apple"])
        self.assertEqual(transition3.status, TransitionStatus.NO_CHANGE)

    def test_stuck_time_calculation(self):
        # Initial wait
        time.sleep(0.1)
        stuck_time = self.engine.time_since_last_progress()
        self.assertGreaterEqual(stuck_time, 0.1)

        # Unsuccessful update should not reset the timer
        self.engine.update(["orange"])
        self.assertGreaterEqual(self.engine.time_since_last_progress(), 0.1)

        # Advance, should reset timer
        self.engine.update(["apple"])
        stuck_time_after = self.engine.time_since_last_progress()
        self.assertLess(stuck_time_after, 0.05)


if __name__ == "__main__":
    unittest.main()
