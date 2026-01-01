#!/bin/bash

export G_MESSAGES_DEBUG=all
export SHELL_DEBUG=all

export EXTENSION_ID="gnome-wayland-wallpaper-slideshow@jordanblakey.dev"
export EXTENSION_DISPLAY_NAME="Wallpaper Slideshow (Wayland compatible)"

make cycle
clear

echo -e '\e[32mstarting dbus-run-session gnome-shell with PID:' $! '\e[0m'

dbus-run-session gnome-shell --devkit --wayland 2>&1 | grep "Wall" &

sleep 11
pkill -f "gnome-shell --devkit"
sleep 1
echo -e "\e[32m###############################\e[0m"
echo -e "\e[32mSTOPPED dbus-run-session\e[0m"
echo -e "\e[32m###############################\e[0m"



# gnome-extensions disable $EXTENSION_ID
# gnome-extensions enable $EXTENSION_ID

# gnome-extensions list --enabled
# gnome-extensions-tool --help
# gnome-extensions disable "gnome-wayland-wallpaper-slideshow@jordanblakey.dev"
# gnome-extensions enable "gnome-wayland-wallpaper-slideshow@jordanblakey.dev"

