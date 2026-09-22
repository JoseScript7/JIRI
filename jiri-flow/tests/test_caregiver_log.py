import os
import pytest
from app.logging.caregiver_log import CaregiverLogger


@pytest.fixture
def logger():
    test_db = "logs/test_jiri_flow.db"
    if os.path.exists(test_db):
        os.remove(test_db)

    log = CaregiverLogger(db_path=test_db)
    yield log

    # Cleanup
    if os.path.exists(test_db):
        os.remove(test_db)


def test_logger_inserts_and_retrieves(logger):
    logger.log_event("TEST_EVENT", "This is a test.")
    logger.log_event("STEP_COMPLETED", "Completed 'fill kettle'")

    logs = logger.get_recent_log(10)
    assert len(logs) == 2

    # get_recent_log returns newest first
    assert logs[0]["event_type"] == "STEP_COMPLETED"
    assert logs[0]["details"] == "Completed 'fill kettle'"

    assert logs[1]["event_type"] == "TEST_EVENT"
    assert logs[1]["details"] == "This is a test."
