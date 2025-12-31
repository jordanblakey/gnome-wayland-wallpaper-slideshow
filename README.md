# GNOME Shell Wallpaper Switcher Extension

A GNOME Shell extension that automatically cycles through desktop backgrounds from a specified folder.

## Features
- Select any folder containing images.
- Configurable switch interval (seconds).
- Automatic smooth transitions (native GNOME behavior).
- Low resource usage (only active during switch).

## Installation

### Prerequisites
- GNOME Shell 49
- `zip` utility

### Manual Installation

1. **Clone or Download** this repository.
2. **Pack the Extension**:
    From the root of the project, run:
    ```bash
    gnome-extensions pack --force
    ```
    This will create a `.zip` file in the directory (e.g., `wallpaper-switcher@antigravity.dev.shell-extension.zip`).

3. **Install the Extension**:
    ```bash
    gnome-extensions install wallpaper-switcher@antigravity.dev.shell-extension.zip --force
    ```

4. **Restart GNOME Shell**:
    - **Wayland**: Log out and log back in.
    - **X11**: Press `Alt+F2`, type `r`, and press Enter.

5. **Enable the Extension**:
    ```bash
    gnome-extensions enable wallpaper-switcher@antigravity.dev
    ```
    Or use the **Extensions** app (`gnome-extensions-app`) to enable it and configure preferences.

## Configuration

Open the **Extensions** app, find "Wallpaper Switcher", and click the **Settings** button.
- **Wallpaper Folder**: Choose the directory containing your images.
- **Switch Interval**: Set how often (in seconds) the wallpaper changes. Default is 300 seconds (5 minutes).
