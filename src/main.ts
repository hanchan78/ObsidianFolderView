import { MarkdownPostProcessorContext, Plugin } from "obsidian";
import {
	CollapsedFolderState,
	FolderViewData,
} from "./CollapsedFolderState";
import { FolderView } from "./FolderView";

export default class FolderViewPlugin extends Plugin {
	private folderView!: FolderView;

	async onload(): Promise<void> {
		const data = await this.loadFolderViewData();
		const collapsedFolderState = new CollapsedFolderState(
			data.collapsedFolders,
			(updatedData) => this.saveData(updatedData)
		);

		this.folderView = new FolderView(
			this.app,
			collapsedFolderState
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

	private async loadFolderViewData(): Promise<FolderViewData> {
		const data: unknown = await this.loadData();

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
			};
		}

		return {
			collapsedFolders: [],
		};
	}
}
