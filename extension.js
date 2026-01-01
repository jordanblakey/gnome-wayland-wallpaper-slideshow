import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import St from 'gi://St';

import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';

import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

// Register the indicator class - this is the top bar icon and popup menu
const Indicator = GObject.registerClass(
    class Indicator extends PanelMenu.Button {
        _init() {
            super._init(0.0, _('Wallpaper Slideshow'));

            // Add the icon to the panel menu button
            this.add_child(new St.Icon({
                // Use https://flathub.org/en/apps/org.gnome.design.IconLibrary to find icons
                icon_name: 'preferences-desktop-wallpaper-symbolic',
                style_class: 'system-status-icon',
            }));

            // Add the title to the panel menu button
            // PanelMenu.Button -> PopupBaseMenuItem -> Label
            const titleItem = new PopupMenu.PopupBaseMenuItem({
                reactive: false,
                can_focus: false
            });
            const label = new St.Label({
                text: 'Wallpaper Slideshow',
                // you can use CSS here if desired
            });
            titleItem.add_child(label);
            this.menu.addMenuItem(titleItem);

            // We need the extension instances to register the menu option for settings
            // Otherwise we could do it here instead of in the WallpaperSlideshowExtension class
        }
    });


export default class WallpaperSlideshowExtension extends Extension {
    // Lifecycle methods enable() and disable() are called when the extension is enabled and disabled
    enable() {
        console.log('[Wallpaper Slideshow] extension enabled');

        // Here we instantiate the indicator class we created above
        this._indicator = new Indicator();

        // Add settings menu item, now that we have the WallpaperSlideshowExtension instance
        const settingsItem = new PopupMenu.PopupMenuItem(_('Settings'));
        settingsItem.connect('activate', () => {
            this.openPreferences(); // This is the method we needed to pop the settings window
        });
        this._indicator.menu.addMenuItem(settingsItem);

        // Add the indicator to the panel
        Main.panel.addToStatusArea(this.uuid, this._indicator);

        this._settings = this.getSettings();
        this._backgroundSettings = new Gio.Settings({ schema_id: 'org.gnome.desktop.background' });
        this._timeoutId = null;

        // Monitor settings changes
        this._settings.connect('changed::delay-seconds', () => {
            this._resetTimer();
        });

        this._settings.connect('changed::wallpaper-folder', () => {
            this._changeWallpaper(); // Immediate change on folder update
        });

        // Initial switch on load
        this._changeWallpaper();

        // Start initial timer
        this._resetTimer();

        console.log('[Wallpaper Slideshow] reached the end of enable()');
    }

    disable() {
        console.log('[Wallpaper Slideshow] extension disabled');

        // Remove the indicator from the panel
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }

        if (this._timeoutId) {
            GLib.source_remove(this._timeoutId);
            this._timeoutId = null;
        }
        this._settings = null;
        this._backgroundSettings = null;
    }

    _resetTimer() {
        if (this._timeoutId) {
            GLib.source_remove(this._timeoutId);
            this._timeoutId = null;
        }

        const delay = this._settings.get_int('delay-seconds');
        // Prevent extremely short loops
        const safeDelay = Math.max(delay, 5);

        this._timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, safeDelay, () => {
            this._changeWallpaper();
            return GLib.SOURCE_CONTINUE;
        });
        console.log('[Wallpaper Slideshow] timer reset');
    }

    _changeWallpaper() {
        console.log('[Wallpaper Slideshow] changing wallpaper');
        const folderPath = this._settings.get_string('wallpaper-folder');
        if (!folderPath) return;

        const dir = Gio.File.new_for_path(folderPath);
        if (!dir.query_exists(null)) return;

        // Enumerate files asynchronously or synchronously? 
        // Sync is easier but can block. For a folder with limited images it's fine.
        // Let's use standard directory enumeration.

        try {
            const children = [];
            const enumerator = dir.enumerate_children('standard::name,standard::content-type', Gio.FileQueryInfoFlags.NONE, null);

            let info;
            while ((info = enumerator.next_file(null)) !== null) {
                const contentType = info.get_content_type();
                if (contentType.startsWith('image/')) {
                    children.push(info.get_name());
                }
            }
            enumerator.close(null);

            if (children.length === 0) return;

            // Pick random
            const randomIndex = Math.floor(Math.random() * children.length);
            const randomImage = children[randomIndex];
            const fullPath = dir.get_child(randomImage).get_uri(); // picture-uri requires URI

            // Update background
            // GNOME uses picture-uri for light theme and picture-uri-dark for dark theme usually. 
            // We'll set both to be safe/consistent.

            // Note: transition mechanics are handled by GNOME Shell's background manager automatically 
            // when these keys change.
            this._backgroundSettings.set_string('picture-uri', fullPath);
            this._backgroundSettings.set_string('picture-uri-dark', fullPath);

        } catch (e) {
            console.error(`Wallpaper Slideshow Error: ${e.message}`);
        }
        console.log('[Wallpaper Slideshow] wallpaper changed');
    }
}
