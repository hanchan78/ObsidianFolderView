import { MarkdownPostProcessorContext, Plugin } from "obsidian";
import {
	CollapsedFolderState,
	FolderViewData,
} from "./CollapsedFolderState";
import { FolderView } from "./FolderView";
import {
	DEFAULT_SETTINGS,
	FolderViewSettings,
	FolderViewSettingTab,
} from "./Settings";

interface PluginData extends FolderViewData {
	settings: FolderViewSettings;
}

export default class FolderViewPlugin extends Plugin {
	private folderView!: FolderView;
	private collapsedFolderState!: CollapsedFolderState;
	private settings: FolderViewSettings = DEFAULT_SETTINGS;

	async onload(): Promise<void> {
		const data = await this.loadFolderViewData();
		this.settings = data.settings;
		this.collapsedFolderState = new CollapsedFolderState(
			data.collapsedFolders,
			() => this.savePluginData()
		);

		this.folderView = new FolderView(
			this.app,
			this.collapsedFolderState,
			this.settings
		);

		this.addSettingTab(
			new FolderViewSettingTab(
				this.app,
				this,
				() => this.settings,
				(settings) => this.updateSettings(settings)
			)
		);

		this.registerEvent(
			this.app.vault.on("create", (file) => {
				this.folderView.handleVaultChanges(file.path);
			})
		);
		this.registerEvent(
			this.app.vault.on("delete", (file) => {
				this.folderView.handleVaultChanges(file.path);
			})
		);
		this.registerEvent(
			this.app.vault.on("rename", (file, oldPath) => {
				this.folderView.handleVaultChanges(
					oldPath,
					file.path
				);
			})
		);

		this.registerMarkdownCodeBlockProcessor(
			"folderview",
			async (
				source: string,
				el: HTMLElement,
				ctx: MarkdownPostProcessorContext
			) => {
				ctx.addChild(
					this.folderView.createRenderChild(el, source)
				);
			}
		);
	}

	private async updateSettings(
		settings: FolderViewSettings
	): Promise<void> {
		this.settings = settings;
		await this.savePluginData();
		this.folderView.updateSettings(settings);
	}

	private async savePluginData(): Promise<void> {
		await this.saveData({
			collapsedFolders:
				this.collapsedFolderState.getCollapsedFolders(),
			settings: this.settings,
		});
	}

	private async loadFolderViewData(): Promise<PluginData> {
		const data: unknown = await this.loadData();
		const settings = this.loadSettings(data);

		if (
			typeof data === "object" &&
			data !== null &&
			"collapsedFolders" in data &&
			Array.isArray(data.collapsedFolders)
		) {
			return {
				collapsedFolders: data.collapsedFolders.filter(
					(path): path is string => typeof path === "string"
				),
				settings,
			};
		}

		return {
			collapsedFolders: [],
			settings,
		};
	}

	private loadSettings(data: unknown): FolderViewSettings {
		if (typeof data !== "object" || data === null || !("settings" in data)) {
			return { ...DEFAULT_SETTINGS };
		}

		const settings = data.settings;
		if (typeof settings !== "object" || settings === null) {
			return { ...DEFAULT_SETTINGS };
		}

		return {
			sortDirection:
				"sortDirection" in settings &&
				settings.sortDirection === "descending"
					? "descending"
					: "ascending",
			itemOrder:
				"itemOrder" in settings &&
				settings.itemOrder === "folders-first"
					? "folders-first"
					: "files-first",
			showFileExtensions:
				!("showFileExtensions" in settings) ||
				settings.showFileExtensions !== false,
			folderIcon: this.loadStringSetting(
				settings,
				"folderIcon",
				DEFAULT_SETTINGS.folderIcon
			),
			defaultFileIcon: this.loadStringSetting(
				settings,
				"defaultFileIcon",
				DEFAULT_SETTINGS.defaultFileIcon
			),
			fileIconOverrides: this.loadStringSetting(
				settings,
				"fileIconOverrides",
				DEFAULT_SETTINGS.fileIconOverrides
			),
		};
	}

	private loadStringSetting(
		settings: object,
		key: string,
		fallback: string
	): string {
		if (!(key in settings)) {
			return fallback;
		}

		const value = (settings as Record<string, unknown>)[key];
		return typeof value === "string" ? value : fallback;
	}
}
