import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

sys.path.append(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)
from app.logging.caregiver_log import CaregiverLogger

app = FastAPI(title="JIRI Flow Dashboard API")

# Allow the dashboard (served from port 8000) to fetch Singify on port 4000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the static directory
static_dir = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

logger = CaregiverLogger()


@app.get("/log")
def get_log():
    logs = logger.get_recent_log(50)
    return logs


@app.post("/ingest_report")
def ingest_report(report: dict):
    """
    Accepts a Singify caregiver report JSON and merges it into the shared
    JIRI Flow event log so both systems appear on one unified timeline.
    """
    logger.merge_external_report("singify", report)
    return {"status": "ok"}


class Step(BaseModel):
    name: str
    required_objects: list[str]


class Routine(BaseModel):
    id: str
    name: str
    steps: list[Step]


@app.post("/api/routine")
def create_routine(routine: Routine):
    routine_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        "routines",
        f"{routine.id}.json",
    )

    import json

    # Format steps to match schema
    formatted_steps = []
    for i, step in enumerate(routine.steps):
        formatted_steps.append(
            {
                "id": f"step_{i+1}",
                "name": step.name,
                "required_objects": step.required_objects,
                "order": i + 1,
            }
        )

    routine_dict = {"id": routine.id, "name": routine.name, "steps": formatted_steps}

    with open(routine_path, "w") as f:
        json.dump(routine_dict, f, indent=2)

    return {"status": "success", "file": f"{routine.id}.json"}


@app.get("/configure", response_class=HTMLResponse)
def read_configure():
    with open(os.path.join(static_dir, "configure.html"), "r") as f:
        return f.read()


@app.get("/", response_class=HTMLResponse)
def read_root():
    # Redirect root to dashboard
    with open(os.path.join(static_dir, "dashboard.html"), "r") as f:
        return f.read()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
