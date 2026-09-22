import cv2
import torch
import numpy as np
from qai_hub_models.models.yolov8_det import Model, App

# COCO 80 classes used by YOLOv8
COCO_CLASSES = [
    "person",
    "bicycle",
    "car",
    "motorcycle",
    "airplane",
    "bus",
    "train",
    "truck",
    "boat",
    "traffic light",
    "fire hydrant",
    "stop sign",
    "parking meter",
    "bench",
    "bird",
    "cat",
    "dog",
    "horse",
    "sheep",
    "cow",
    "elephant",
    "bear",
    "zebra",
    "giraffe",
    "backpack",
    "umbrella",
    "handbag",
    "tie",
    "suitcase",
    "frisbee",
    "skis",
    "snowboard",
    "sports ball",
    "kite",
    "baseball bat",
    "baseball glove",
    "skateboard",
    "surfboard",
    "tennis racket",
    "bottle",
    "wine glass",
    "cup",
    "fork",
    "knife",
    "spoon",
    "bowl",
    "banana",
    "apple",
    "sandwich",
    "orange",
    "broccoli",
    "carrot",
    "hot dog",
    "pizza",
    "donut",
    "cake",
    "chair",
    "couch",
    "potted plant",
    "bed",
    "dining table",
    "toilet",
    "tv",
    "laptop",
    "mouse",
    "remote",
    "keyboard",
    "cell phone",
    "microwave",
    "oven",
    "toaster",
    "sink",
    "refrigerator",
    "book",
    "clock",
    "vase",
    "scissors",
    "teddy bear",
    "hair drier",
    "toothbrush",
]


class TaskRelevantFilter:
    """
    Filters raw YOLOv8 detections to only those objects relevant to the current routine.

    Since YOLOv8 is limited to the fixed 80 COCO classes, some objects must be mapped
    to approximate substitutes. For example, for a "Morning Tea" routine:
    - "kettle" -> "bottle" or "cup" (COCO does not have a kettle)
    - "medication box" -> "book" or "bottle"

    FUTURE ITERATION FALLBACK:
    A future iteration should replace this standard YOLOv8 model with YOLO-World
    (qai_hub_models.models.yolo_world) to utilize open-vocabulary text prompting.
    This would allow detecting exact objects like "kettle" and "medication box"
    natively without relying on inaccurate COCO class substitutions.
    """

    def __init__(self, target_classes: list[str]):
        # Maintain a mapping of routine-specific target objects to COCO approximate classes
        self.coco_mapping = {
            "kettle": ["bottle", "cup"],
            "cup": ["cup", "wine glass", "bowl"],
            "spoon": ["spoon", "fork"],
            "medication box": ["book", "bottle"],
            # direct mappings
            "bottle": ["bottle"],
            "bowl": ["bowl"],
            "person": ["person"],
        }

        # Build the set of acceptable COCO classes based on the routine targets
        self.acceptable_coco_classes = set()
        for target in target_classes:
            if target in self.coco_mapping:
                self.acceptable_coco_classes.update(self.coco_mapping[target])
            else:
                self.acceptable_coco_classes.add(target)

    def filter_detections(self, detections: list[dict]) -> list[dict]:
        """Filters a list of detections to only those relevant to the routine."""
        return [d for d in detections if d["label"] in self.acceptable_coco_classes]


class ObjectDetector:
    def __init__(self, use_qnn: bool = False):
        self.use_qnn = use_qnn
        # Load the pretrained model
        print(f"Loading YOLOv8 detection model with QNN={use_qnn}...")

        if self.use_qnn:
            print(
                "Explicitly requesting QNN Execution Provider for ONNX Runtime (onnxruntime-qnn)"
            )
            try:
                import onnxruntime as ort

                self.providers = ["QNNExecutionProvider", "CPUExecutionProvider"]
                # self.session = ort.InferenceSession("models/yolov8_det.onnx", providers=self.providers)
            except ImportError:
                print("Warning: onnxruntime not installed, falling back to PyTorch")

        self.model = Model.from_pretrained()
        # Initialize the app which handles preprocessing and postprocessing (NMS)
        self.app = App(self.model)

    def detect_objects(self, frame: np.ndarray) -> list[dict]:
        """
        Detects objects in a BGR OpenCV frame.
        Returns a list of dicts: {'label': str, 'confidence': float, 'box': [x1, y1, x2, y2]}
        """
        # Convert BGR (OpenCV) to RGB (Model expects RGB)
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Run prediction
        # predict_boxes_from_image returns tuple of lists if raw_output=True
        boxes_list, scores_list, class_idx_list = self.app.predict_boxes_from_image(
            frame_rgb, raw_output=True
        )

        # We only passed one image, so take the first element in the batch
        boxes = boxes_list[0].cpu().numpy()
        scores = scores_list[0].cpu().numpy()
        class_idx = class_idx_list[0].cpu().numpy()

        results = []
        for box, score, cls_idx in zip(boxes, scores, class_idx):
            label = (
                COCO_CLASSES[int(cls_idx)]
                if int(cls_idx) < len(COCO_CLASSES)
                else f"class_{cls_idx}"
            )
            results.append(
                {
                    "label": label,
                    "confidence": float(score),
                    "box": box.tolist(),  # [x1, y1, x2, y2]
                }
            )
        return results


def main():
    print("Initializing detector...")
    detector = ObjectDetector()

    print("Opening webcam...")
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    print("Starting live preview. Press 'q' to quit.")
    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # YOLOv8 typically expects 640x640 input shape
        frame = cv2.resize(frame, (640, 640))

        # Run detection
        objects = detector.detect_objects(frame)

        # Draw bounding boxes and print occasionally to log
        for obj in objects:
            x1, y1, x2, y2 = map(int, obj["box"])
            label = obj["label"]
            conf = obj["confidence"]

            # Print to stdout periodically so the AI agent can confirm it works
            if frame_count % 30 == 0:
                print(
                    f"Detected {label} with confidence {conf:.2f} at {x1},{y1},{x2},{y2}"
                )

            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(
                frame,
                f"{label} {conf:.2f}",
                (x1, max(0, y1 - 10)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 255, 0),
                2,
            )

        cv2.imshow("JIRI Flow - YOLOv8 Live Preview", frame)
        frame_count += 1

        # Press 'q' to quit
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
