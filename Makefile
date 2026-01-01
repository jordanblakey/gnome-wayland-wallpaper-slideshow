# Makefile for Wallpaper Switcher Extension
UUID = gnome-wayland-wallpaper-slideshow@jordanblakey.dev
INSTALL_DIR = $(HOME)/.local/share/gnome-shell/extensions/$(UUID)

.PHONY: all pack install install-local enable disable reload clean logs schemas

all: schemas pack

# Compile GSettings schemas
schemas:
	glib-compile-schemas schemas/

# Pack the extension into a zip file
pack: schemas
	gnome-extensions pack --force

# Install locally (copies files to extension dir) - useful for dev
install: schemas
	rm -rf $(INSTALL_DIR)
	mkdir -p $(INSTALL_DIR)
	cp -r * $(INSTALL_DIR)
	rm $(INSTALL_DIR)/Makefile
	rm -rf $(INSTALL_DIR)/.git
	@echo "Installed to $(INSTALL_DIR)"
	@echo "Restart GNOME Shell (Alt+F2 -> r) to apply changes."

# Enable the extension
enable:
	gnome-extensions enable $(UUID)

# Disable the extension
disable:
	gnome-extensions disable $(UUID)

# Reload the extension (disable then enable)
reload: 
	make disable && make enable

# Do everything
cycle: 
	make && make install && make reload

dev: 
	make cycle && ./run-debug-session.sh


# Clean build artifacts
clean:
	rm -f schemas/gschemas.compiled
	rm -f *.zip

# View GNOME Shell logs (filtered)
logs:
	journalctl -f -o cat /usr/bin/gnome-shell
