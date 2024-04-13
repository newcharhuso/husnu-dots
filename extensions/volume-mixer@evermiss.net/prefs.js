var prefs = (function () {
    'use strict';

    const { Gtk: Gtk$1, GObject: GObject$1 } = imports.gi;

    const VolumeMixerAddFilterDialog = GObject$1.registerClass({
        GTypeName: 'VolumeMixerAddFilterDialog',
    }, class VolumeMixerAddFilterDialog extends Gtk$1.Dialog {
        appNameEntry;
        filterListData;

        constructor(callingWidget, filterListData) {
            super({
                use_header_bar: true,
                transient_for: callingWidget.get_root(),
                destroy_with_parent: true,
                modal: true,
                resizable: false,
                title: "Add Filtered Application"
            });

            this.filterListData = filterListData;

            const addButton = this.add_button("Add", Gtk$1.ResponseType.OK);
            addButton.get_style_context().add_class('suggested-action');
            addButton.sensitive = false;
            this.add_button("Cancel", Gtk$1.ResponseType.CANCEL);

            const dialogContent = this.get_content_area();
            dialogContent.margin_top = 20;
            dialogContent.margin_bottom = 20;
            dialogContent.margin_end = 20;
            dialogContent.margin_start = 20;

            const appNameLabel = new Gtk$1.Label({
                label: "Application name",
                halign: Gtk$1.Align.START,
                margin_bottom: 10
            });
            dialogContent.append(appNameLabel);

            this.appNameEntry = new Gtk$1.Entry();
            this.appNameEntry.connect('activate', () => {
                if (this.checkInputValid()) {
                    this.response(Gtk$1.ResponseType.OK);
                }
            });
            dialogContent.append(this.appNameEntry);

            this.appNameEntry.connect("changed", () => {
                addButton.sensitive = this.checkInputValid();
            });
        }

        checkInputValid() {
            if (this.appNameEntry.text.length === 0) {
                return false;
            } else if (this.filterListData.indexOf(this.appNameEntry.text) !== -1) {
                return false;
            } else {
                return true;
            }
        }
    });

    const { Adw, Gio, Gtk, GObject } = imports.gi;
    const ExtensionUtils = imports.misc.extensionUtils;

    const VolumeMixerPrefsPage = GObject.registerClass({
        GTypeName: 'VolumeMixerPrefsPage',
    }, class VolumeMixerPrefsPage extends Adw.PreferencesPage {
        filterListData = [];
        filteredAppsGroup;
        settings;
        addFilteredAppButtonRow;

        constructor() {
            // TODO: Move most of this into a .ui file.
            super();

            this.settings = ExtensionUtils.getSettings("net.evermiss.mymindstorm.volume-mixer");
            this.filterListData = this.settings.get_strv("filtered-apps");

            // Group for general settings
            const generalGroup = new Adw.PreferencesGroup();
            this.add(generalGroup);

            // show-description
            const showDescRow = new Adw.ActionRow({ title: 'Show Audio Stream Description' });
            generalGroup.add(showDescRow);

            const showDescToggle = new Gtk.Switch({
                active: this.settings.get_boolean('show-description'),
                valign: Gtk.Align.CENTER,
            });
            this.settings.bind(
                'show-description',
                showDescToggle,
                'active',
                Gio.SettingsBindFlags.DEFAULT
            );

            showDescRow.add_suffix(showDescToggle);
            showDescRow.activatable_widget = showDescToggle;

            // show-icon
            const showIconRow = new Adw.ActionRow({ title: 'Show Application Icon' });
            generalGroup.add(showIconRow);

            const showIconToggle = new Gtk.Switch({
                active: this.settings.get_boolean('show-icon'),
                valign: Gtk.Align.CENTER
            });
            this.settings.bind(
                'show-icon',
                showIconToggle,
                'active',
                Gio.SettingsBindFlags.DEFAULT
            );

            showIconRow.add_suffix(showIconToggle);
            showIconRow.activatable_widget = showIconToggle;

            // Application filter settings group
            const filterGroup = new Adw.PreferencesGroup({
                title: 'Application Filtering',
                description: 'Hide applications from the volume mixer.'
            });
            this.add(filterGroup);

            // filter-mode
            const filterModeModel = new Gio.ListStore({ item_type: FilterMode });
            filterModeModel.append(new FilterMode('Block', 'block'));
            filterModeModel.append(new FilterMode('Allow', 'allow'));

            const findCurrentFilterMode = () => {
                for (let i = 0; i < filterModeModel.get_n_items(); i++) {
                    if (filterModeModel.get_item(i).value === this.settings.get_string('filter-mode')) {
                        return i;
                    }
                }
                return -1;
            };

            const filterModeRow = new Adw.ComboRow({
                title: 'Filter Mode',
                model: filterModeModel,
                expression: new Gtk.PropertyExpression(FilterMode, null, 'name'),
                selected: findCurrentFilterMode()
            });
            filterGroup.add(filterModeRow);

            filterModeRow.connect('notify::selected', () => {
                this.settings.set_string('filter-mode', filterModeRow.selectedItem.value);
            });

            // group to act as spacer for filter list
            this.filteredAppsGroup = new Adw.PreferencesGroup();
            this.add(this.filteredAppsGroup);

            // List of filtered apps
            for (const filteredAppName of this.filterListData) {
                this.filteredAppsGroup.add(this.buildFilterListRow(filteredAppName));
            }

            // Add filter entry button
            this.createAddFilteredAppButtonRow();

            // TODO: modes
            // - group by application
            // - group by application but as a dropdown with streams
            // - show all streams
            // TODO: go thru github issues
            // popularity: page 26, 5th from the top
            // TODO: style
        }

        createAddFilteredAppButtonRow() {
            // I wanted to use Adw.PrefrencesRow, but you can't get the 'row-activated' signal unless it's part of a Gtk.ListBox.
            // Adw.PrefrencesGroup doesn't extend Gtk.ListBox.
            // TODO: Learn a less hacky to do this. I'm currently too new to GTK to know the best practice.
            this.addFilteredAppButtonRow = new Adw.ActionRow();
            const addIcon = Gtk.Image.new_from_icon_name("list-add");
            addIcon.height_request = 40;
            this.addFilteredAppButtonRow.set_child(addIcon);
            this.filteredAppsGroup.add(this.addFilteredAppButtonRow);
            // It won't send 'activated' signal w/o this being set.
            this.addFilteredAppButtonRow.activatable_widget = addIcon;
            this.addFilteredAppButtonRow.connect('activated', (callingWidget) => {
                this.showFilteredAppDialog(callingWidget, this.filterListData);
            });
        }

        buildFilterListRow(filteredAppName) {
            const filterListRow = new Adw.PreferencesRow({
                title: filteredAppName,
                activatable: false,
            });

            // Make box for custom row
            const filterListBox = new Gtk.Box({
                margin_bottom:6,
                margin_top: 6,
                margin_end: 15,
                margin_start: 15
            });

            // Add title
            const filterListLabel = Gtk.Label.new(filterListRow.title);
            filterListLabel.hexpand = true;
            filterListLabel.halign = Gtk.Align.START;
            filterListBox.append(filterListLabel);

            // Add remove button
            const filterListButton = new Gtk.Button({
                halign: Gtk.Align.END
            });

            // Add icon to remove button
            const filterListImage = Gtk.Image.new_from_icon_name("user-trash-symbolic");
            filterListButton.set_child(filterListImage);

            // Tie action to remove button
            filterListButton.connect("clicked", (_button) => this.removeFilteredApp(filteredAppName, filterListRow));

            filterListBox.append(filterListButton);
            filterListRow.set_child(filterListBox);

            return filterListRow
        }

        removeFilteredApp(filteredAppName, filterListRow) {
            this.filterListData.splice(this.filterListData.indexOf(filteredAppName), 1);
            this.settings.set_strv("filtered-apps", this.filterListData);
            this.filteredAppsGroup.remove(filterListRow);
        }

        addFilteredApp(filteredAppName) {
            this.filterListData.push(filteredAppName);
            this.settings.set_strv("filtered-apps", this.filterListData);
            this.filteredAppsGroup.remove(this.addFilteredAppButtonRow);
            this.filteredAppsGroup.add(this.buildFilterListRow(filteredAppName));
            this.filteredAppsGroup.add(this.addFilteredAppButtonRow);
        }

        showFilteredAppDialog(callingWidget, filterListData) {
            const dialog = new VolumeMixerAddFilterDialog(callingWidget, filterListData);
            dialog.connect('response', (_dialog, response) => {
                if (response === Gtk.ResponseType.OK) {
                    this.addFilteredApp(dialog.appNameEntry.text);
                }
                dialog.close();
                dialog.destroy();
            });
            dialog.show();
        }
    });

    const FilterMode = GObject.registerClass({
        Properties: {
            'name': GObject.ParamSpec.string(
                'name', 'name', 'name',
                GObject.ParamFlags.READWRITE,
                null),
            'value': GObject.ParamSpec.string(
                'value', 'value', 'value',
                GObject.ParamFlags.READWRITE,
                null),
        },
    }, class FilterMode extends GObject.Object {
        _init(name, value) {
            super._init({ name, value });
        }
    });

    function init() {
    }

    function fillPreferencesWindow(window) {
        window.add(new VolumeMixerPrefsPage());
    }

    var prefs = {
        init,
        fillPreferencesWindow
    };

    return prefs;

})();
var init = prefs.init;
var fillPreferencesWindow = prefs.fillPreferencesWindow;
