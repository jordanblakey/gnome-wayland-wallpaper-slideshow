#!/bin/bash

# Show all debug messages
export G_MESSAGES_DEBUG=all
export SHELL_DEBUG=all

export EXTENSION_ID="gnome-wayland-wallpaper-slideshow@jordanblakey.dev"
export EXTENSION_DISPLAY_NAME="Wallpaper Slideshow (Wayland compatible)"

# gnome-extensions disable $EXTENSION_ID
# gnome-extensions enable $EXTENSION_ID
# gnome-extensions list --enabled
# gnome-extensions-tool --help

# Filter output to only show messages from our extension -- be aware this makes exceptions silent!
dbus-run-session gnome-shell --devkit --wayland 2>&1 | grep "Wallpaper Slideshow" &
echo -e "\e[32mStarting: dbus-run-session gnome-shell with PID $!\e[0m"

sleep 12
pkill -f "gnome-shell --devkit"
sleep 1
echo -e "\e[32m###############################\e[0m"
echo -e "\e[32mSTOPPED dbus-run-session\e[0m"
echo -e "\e[32m###############################\e[0m"

