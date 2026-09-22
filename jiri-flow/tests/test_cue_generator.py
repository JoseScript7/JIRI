from app.language.cue_generator import CueGenerator


def test_cues():
    generator = CueGenerator()

    test_cases = [
        ("Fill the kettle with water", False),
        ("Turn on the kettle", True),
        ("Place the tea bag in the cup", False),
    ]

    print("\n================== CUE GENERATOR TESTS ==================")
    for step_name, is_retry in test_cases:
        cue = generator.generate_cue(step_name, is_retry)
        print(f"Step:   '{step_name}' (Retry={is_retry})")
        print(f"Output: '{cue}'\n")
    print("=========================================================\n")


if __name__ == "__main__":
    test_cues()
