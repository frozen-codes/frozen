import tkinter as tk
from tkinter import ttk, messagebox
import threading
from database import init_db, add_task, get_tasks, update_task_status, delete_task
from pomodoro import pomodoro_timer, save_settings, load_settings

# Initialize the database
init_db()

# Tkinter setup
app = tk.Tk()
app.title("Pomodoro To-Do App")
app.geometry("400x600")

# Global variables for settings
settings = load_settings()

# Functions
def start_pomodoro():
    """Start the Pomodoro timer in a separate thread."""
    threading.Thread(
        target=lambda: pomodoro_timer(
            work_duration=settings["work_duration"],
            short_break=settings["short_break"],
            long_break=settings["long_break"]
        ),
        daemon=True
    ).start()

def add_task_ui():
    """UI for adding a new task."""
    title = task_title.get()
    priority = task_priority.get()
    if title and priority:
        add_task(title, priority)
        refresh_task_list()
        task_title.set("")
        task_priority.set("")
    else:
        messagebox.showwarning("Validation Error", "All fields are required.")

def refresh_task_list():
    """Refresh the task list display."""
    for widget in task_frame.winfo_children():
        widget.destroy()
    tasks = get_tasks()
    for task in tasks:
        task_id, title, priority, completed = task
        task_text = f"{title} [{priority}]"
        check_var = tk.IntVar(value=completed)
        check_button = tk.Checkbutton(
            task_frame,
            text=task_text,
            variable=check_var,
            command=lambda tid=task_id, c=check_var: update_task_status(tid, c.get())
        )
        check_button.pack(anchor="w", padx=10, pady=2)

        delete_button = tk.Button(
            task_frame,
            text="Delete",
            command=lambda tid=task_id: [delete_task(tid), refresh_task_list()],
            bg="red",
            fg="white"
        )
        delete_button.pack(anchor="e", padx=10, pady=2)

def open_settings():
    """Open a settings window."""
    def save_new_settings():
        work_duration = int(work_input.get())
        short_break = int(short_break_input.get())
        long_break = int(long_break_input.get())
        save_settings(work_duration, short_break, long_break)
        messagebox.showinfo("Settings Saved", "Pomodoro durations updated successfully!")
        settings_window.destroy()

    settings_window = tk.Toplevel(app)
    settings_window.title("Settings")
    settings_window.geometry("300x200")

    tk.Label(settings_window, text="Work Duration (min):").pack(pady=5)
    work_input = tk.Entry(settings_window)
    work_input.insert(0, str(settings["work_duration"]))
    work_input.pack()

    tk.Label(settings_window, text="Short Break (min):").pack(pady=5)
    short_break_input = tk.Entry(settings_window)
    short_break_input.insert(0, str(settings["short_break"]))
    short_break_input.pack()

    tk.Label(settings_window, text="Long Break (min):").pack(pady=5)
    long_break_input = tk.Entry(settings_window)
    long_break_input.insert(0, str(settings["long_break"]))
    long_break_input.pack()

    tk.Button(settings_window, text="Save", command=save_new_settings).pack(pady=10)

# UI Widgets
task_title = tk.StringVar()
task_priority = tk.StringVar()

tk.Label(app, text="Task Title").pack(pady=5)
tk.Entry(app, textvariable=task_title).pack(pady=5)

tk.Label(app, text="Task Priority").pack(pady=5)
ttk.Combobox(app, textvariable=task_priority, values=["High", "Medium", "Low"]).pack(pady=5)

tk.Button(app, text="Add Task", command=add_task_ui).pack(pady=10)

tk.Button(app, text="Start Pomodoro", command=start_pomodoro).pack(pady=10)

task_frame = tk.Frame(app)
task_frame.pack(fill="both", expand=True, pady=10)

refresh_task_list()

tk.Button(app, text="Settings", command=open_settings).pack(pady=10)

app.mainloop()
