import { App, Plugin, PluginSettingTab, Setting } from "obsidian";

export type SortDirection = "ascending" | "descending";
export type ItemOrder = "files-first" | "folders-first";

export interface FolderViewSettings {
	sortDirection: SortDirection;
	itemOrder: ItemOrder;
	showFileExtensions: boolean;
	folderIcon: string;
	defaultFileIcon: string;
	fileIconOverrides: string;
}

export const DEFAULT_SETTINGS: FolderViewSettings = {
	sortDirection: "ascending",
	itemOrder: "files-first",
	showFileExtensions: true,
	folderIcon: "folder",
	defaultFileIcon: "file",
	fileIconOverrides: "",
};

export class FolderViewSettingTab extends PluginSettingTab {
	constructor(
		app: App,
		plugin: Plugin,
		private readonly getSettings: () => FolderViewSettings,
		private readonly updateSettings: (
			settings: FolderViewSettings
		) => Promise<void>
	) {
		super(app, plugin);
	}

	display(): void {
		this.containerEl.empty();

		new Setting(this.containerEl)
			.setName("Sort direction")
			.setDesc("Choose how names are sorted within each group.")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("ascending", "Ascending")
					.addOption("descending", "Descending")
					.setValue(this.getSettings().sortDirection)
					.onChange(async (sortDirection: SortDirection) => {
						await this.updateSettings({
							...this.getSettings(),
							sortDirection,
						});
					})
			);

		new Setting(this.containerEl)
			.setName("Item order")
			.setDesc("Choose which group appears first in every folder.")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("files-first", "Files before folders")
					.addOption("folders-first", "Folders before files")
					.setValue(this.getSettings().itemOrder)
					.onChange(async (itemOrder: ItemOrder) => {
						await this.updateSettings({
							...this.getSettings(),
							itemOrder,
						});
					})
			);

		new Setting(this.containerEl)
			.setName("Show file extensions")
			.setDesc("Show extensions for files other than Markdown notes.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.getSettings().showFileExtensions)
					.onChange(async (showFileExtensions) => {
						await this.updateSettings({
							...this.getSettings(),
							showFileExtensions,
						});
					})
			);

		new Setting(this.containerEl)
			.setName("Folder icon")
			.setDesc("Enter an Obsidian icon name, such as folder-tree.")
			.addText((text) =>
				text
					.setPlaceholder("Folder")
					.setValue(this.getSettings().folderIcon)
					.onChange(async (folderIcon) => {
						await this.updateSettings({
							...this.getSettings(),
							folderIcon: folderIcon.trim(),
						});
					})
			);

		new Setting(this.containerEl)
			.setName("Default file icon")
			.setDesc("Used when a file type has no built-in or custom icon.")
			.addText((text) =>
				text
					.setPlaceholder("File")
					.setValue(this.getSettings().defaultFileIcon)
					.onChange(async (defaultFileIcon) => {
						await this.updateSettings({
							...this.getSettings(),
							defaultFileIcon: defaultFileIcon.trim(),
						});
					})
			);

		new Setting(this.containerEl)
			.setName("File icon overrides")
			.setDesc(
				"Enter one extension and Obsidian icon name per line. Example: CSV: table."
			)
			.addTextArea((textArea) =>
				textArea
					.setPlaceholder("CSV: table\nJSON: braces")
					.setValue(this.getSettings().fileIconOverrides)
					.onChange(async (fileIconOverrides) => {
						await this.updateSettings({
							...this.getSettings(),
							fileIconOverrides,
						});
					})
			);
	}
}
