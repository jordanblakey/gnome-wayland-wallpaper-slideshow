import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';
import Pango from 'gi://Pango';
import { ExtensionPreferences, gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class WallpaperSwitcherPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        window._settings = this.getSettings();

        const page = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup({
            title: _('Settings'),
            description: _('Configure wallpaper switching behavior')
        });
        page.add(group);

        // Wallpaper Folder Row
        const folderRow = new Adw.ActionRow({
            title: _('Wallpaper Folder'),
            subtitle: _('Select the folder containing images')
        });

        // We'll use a Button Content for the chooser button
        const folderButton = new Gtk.Button({
            valign: Gtk.Align.CENTER,
            icon_name: 'folder-open-symbolic'
        });

        // Label to show current path
        const folderLabel = new Gtk.Label({
            label: window._settings.get_string('wallpaper-folder') || _('None selected'),
            ellipsize: Pango.EllipsizeMode.MIDDLE,
            valign: Gtk.Align.CENTER,
            halign: Gtk.Align.END,
            hexpand: true,
            margin_end: 10
        });

        // Click handler for folder selection
        folderButton.connect('clicked', () => {
            const dialog = new Gtk.FileChooserDialog({
                title: _('Select Wallpaper Folder'),
                transient_for: window,
                action: Gtk.FileChooserAction.SELECT_FOLDER
            });
            dialog.add_button(_('Cancel'), Gtk.ResponseType.CANCEL);
            dialog.add_button(_('Select'), Gtk.ResponseType.ACCEPT);

            dialog.connect('response', (d, response_id) => {
                if (response_id === Gtk.ResponseType.ACCEPT) {
                    const file = d.get_file();
                    const path = file.get_path();
                    window._settings.set_string('wallpaper-folder', path);
                    folderLabel.set_label(path);
                }
                d.destroy();
            });

            dialog.present();
        });

        // Update label if setting changes externally
        window._settings.connect('changed::wallpaper-folder', (settings, key) => {
            folderLabel.set_label(settings.get_string(key) || _('None selected'));
        });

        // Layout for folder row
        // Since Adw.ActionRow handles suffixes, we can stick the button there. 
        // We probably want the label to be the subtitle itself or a prefix/suffix.
        // Let's put the button as a suffix and the path as subtitle.

        // Re-implementing folder row to update subtitle
        const folderRowBetter = new Adw.ActionRow({
            title: _('Wallpaper Folder'),
            subtitle: window._settings.get_string('wallpaper-folder') || _('None selected')
        });

        window._settings.connect('changed::wallpaper-folder', (settings, key) => {
            folderRowBetter.set_subtitle(settings.get_string(key) || _('None selected'));
        });

        folderRowBetter.add_suffix(folderButton);
        group.add(folderRowBetter);


        // Delay Row
        const delayRow = new Adw.ActionRow({
            title: _('Switch Interval'),
            subtitle: _('Duration in seconds (default: 300)')
        });

        const delaySpin = new Gtk.SpinButton({
            adjustment: new Gtk.Adjustment({
                lower: 5,
                upper: 86400,
                step_increment: 1,
                page_increment: 60,
                value: window._settings.get_int('delay-seconds')
            }),
            valign: Gtk.Align.CENTER
        });

        window._settings.bind(
            'delay-seconds',
            delaySpin,
            'value',
            Gio.SettingsBindFlags.DEFAULT
        );

        delayRow.add_suffix(delaySpin);
        group.add(delayRow);

        window.add(page);
    }
}
