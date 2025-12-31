import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

export default class MyWallpaperExtension extends Extension {
    enable() {
        this._settings = new Gio.Settings({ schema_id: 'org.gnome.desktop.background' });

        // Example: Set a 5-minute timer
        this._timeout = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 300, () => {
            this._changeWallpaper();
            return GLib.SOURCE_CONTINUE;
        });
    }

    _changeWallpaper() {
        const newPath = 'file:///path/to/your/image.jpg';
        this._settings.set_string('picture-uri', newPath);
        this._settings.set_string('picture-uri-dark', newPath); // Important for Dark Mode
    }

    disable() {
        if (this._timeout) {
            GLib.Source.remove(this._timeout);
            this._timeout = null;
        }
        this._settings = null;
    }
}


import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

export default class MyWallpaperExtension extends Extension {
    enable() {
        this._settings = new Gio.Settings({ schema_id: 'org.gnome.desktop.background' });

        // Example: Set a 5-minute timer
        this._timeout = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 300, () => {
            this._changeWallpaper();
            return GLib.SOURCE_CONTINUE;
        });
    }

    _changeWallpaper() {
        const newPath = 'file:///path/to/your/image.jpg';
        this._settings.set_string('picture-uri', newPath);
        this._settings.set_string('picture-uri-dark', newPath); // Important for Dark Mode
    }

    disable() {
        if (this._timeout) {
            GLib.Source.remove(this._timeout);
            this._timeout = null;
        }
        this._settings = null;
    }
}


// 3. Key Development Tools

// To make this easier, you should install the developer utilities:
// gnome-extensions-app: To enable/disable your work.
// looking-glass: The built-in debugger. Press Alt+F2, type lg, and hit enter. This is your "Console" for the Shell.
// gsettings-desktop-schemas: To explore the keys you can manipulate.

// 4. Important Considerations for Ubuntu 25

// Sandboxing: Ensure your extension has the correct permissions to read from your Pictures folder.
// Dark Mode: GNOME now tracks two separate keys for wallpapers: picture-uri (Light) and picture-uri-dark (Dark). Your extension should probably update both to ensure a consistent experience.
// GNOME Version: Since Ubuntu 25 is very recent, ensure your metadata.json includes the correct shell-version.
// Would you like a sample metadata.json file to ensure the extension is recognized by the system?