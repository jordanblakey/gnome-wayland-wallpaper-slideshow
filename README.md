# GNOME Shell Wallpaper Switcher Extension

A GNOME Shell extension that automatically cycles through desktop backgrounds from a specified folder.

I created this extension because I couldn't find a simple, Wayland-compatible wallpaper switcher that didn't have performance issues.


## Features
- Select any folder containing images.
- Configurable switch interval (seconds).
- Automatic smooth transitions (native GNOME behavior).
- Low resource usage (only active during switch).

## Installation

### Prerequisites
- GNOME Shell 49
- `zip` utility (for building)

### Quick Install (Developer / Advanced)
This project includes a `Makefile` to simplify installation.
1.  **Clone the repository**.
2.  **Run the install command**:
    ```bash
    make cycle
    ```
    This will compile schemas, pack the extension, install it locally, and reload the extension.
    *Note: You may need to restart GNOME Shell (Log out/in or Alt+F2 -> r) for the first installation.*

### Manual Installation

1. **Clone or Download** this repository.
2. **Pack the Extension**:
    From the root of the project, run:
    ```bash
    gnome-extensions pack --force
    ```
    This will create a `.zip` file in the directory (e.g., `gnome-wayland-wallpaper-slideshow@jordanblakey.dev.shell-extension.zip`).

3. **Install the Extension**:
    ```bash
    gnome-extensions install gnome-wayland-wallpaper-slideshow@jordanblakey.dev.shell-extension.zip --force
    ```

4. **Restart GNOME Shell**:
    - **Wayland**: Log out and log back in.
    - **X11**: Press `Alt+F2`, type `r`, and press Enter.

5. **Enable the Extension**:
    ```bash
    gnome-extensions enable gnome-wayland-wallpaper-slideshow@jordanblakey.dev
    ```
    Or use the **Extensions** app (`gnome-extensions-app`) to enable it and configure preferences.

## Configuration

Open the **Extensions** app, find "Gnome (Wayland) Wallpaper Slideshow", and click the **Settings** button.
- **Wallpaper Folder**: Choose the directory containing your images.
- **Switch Interval**: Set how often (in seconds) the wallpaper changes. Default is 1800 seconds (30 minutes).

## Inspect with Looking Glass

Press `Alt + F2`, type `lg`, and press Enter.

In Looking Glass, navigate to the "Extensions" section and find "Gnome (Wayland) Wallpaper Slideshow". You should see the extension's settings and any relevant properties.
