import unittest
from app.vision.detector import TaskRelevantFilter


class TestTaskRelevantFilter(unittest.TestCase):
    def test_filter_detections(self):
        # Configure the filter for a "Morning Tea" routine
        routine_targets = ["kettle", "cup", "spoon"]
        detector_filter = TaskRelevantFilter(routine_targets)

        mock_detections = [
            {
                "label": "bottle",
                "confidence": 0.85,
                "box": [0, 0, 10, 10],
            },  # Mapped substitute for 'kettle'
            {
                "label": "person",
                "confidence": 0.90,
                "box": [20, 20, 50, 50],
            },  # Irrelevant
            {
                "label": "spoon",
                "confidence": 0.75,
                "box": [5, 5, 15, 15],
            },  # Direct match for 'spoon'
            {
                "label": "dog",
                "confidence": 0.60,
                "box": [100, 100, 200, 200],
            },  # Irrelevant
            {
                "label": "cup",
                "confidence": 0.95,
                "box": [30, 30, 40, 40],
            },  # Direct match for 'cup'
        ]

        filtered = detector_filter.filter_detections(mock_detections)

        # We expect bottle, spoon, and cup to pass through
        self.assertEqual(len(filtered), 3)
        labels = [d["label"] for d in filtered]
        self.assertIn("bottle", labels)
        self.assertIn("spoon", labels)
        self.assertIn("cup", labels)

        # Ensure irrelevant detections are removed
        self.assertNotIn("person", labels)
        self.assertNotIn("dog", labels)


if __name__ == "__main__":
    unittest.main()
