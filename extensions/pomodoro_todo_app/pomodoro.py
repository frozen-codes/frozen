import time
from playsound import playsound
from plyer import notification
import json

SETTINGS_FILE = "settings.json"

def pomodoro_timer(work_duration=25, short_break=5, long_break=15, sessions=4):
    """Run the Pomodoro timer."""
    for session in range(1, sessions + 1):
        print(f"Session {session}: Work for {work_duration} minutes.")
        countdown(work_duration * 60)
        notify("Pomodoro Timer", "Work session complete. Take a short break!")
        playsound("sounds/alarm.mp3")

        if session < sessions:
            print(f"Take a short break for {short_break} minutes.")
            countdown(short_break * 60)
        else:
            print(f"Take a long break for {long_break} minutes.")
            countdown(long_break * 60)

        notify("Pomodoro Timer", "Break session complete. Ready to work?")
        playsound("sounds/alarm.mp3")

def countdown(seconds):
    """Countdown timer logic."""
    for remaining in range(seconds, 0, -1):
        mins, secs = divmod(remaining, 60)
        print(f"{mins:02}:{secs:02}", end="\r")
        time.sleep(1)

def notify(title, message):
    """Send desktop notifications."""
    notification.notify(
        title=title,
        message=message,
        timeout=10
    )

def save_settings(work_duration, short_break, long_break):
    """Save Pomodoro settings to a JSON file."""
    settings = {
        "work_duration": work_duration,
        "short_break": short_break,
        "long_break": long_break
    }
    with open(SETTINGS_FILE, "w") as file:
        json.dump(settings, file)

def load_settings():
    """Load Pomodoro settings from a JSON file."""
    try:
        with open(SETTINGS_FILE, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return {"work_duration": 25, "short_break": 5, "long_break": 15}
