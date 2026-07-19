import { App } from "obsidian";
import { IconService } from "./Icons";
import { FileNode, FolderNode } from "./Types";

export class TreeRenderer {
	private readonly iconService: IconService;

	constructor(private readonly app: App) {
		this.iconService = new IconService();
	}

	render(container: HTMLElement, root: FolderNode): void {
		container.empty();

		const list = container.createEl("ul", {
			cls: "folder-view-tree",
		});

		this.renderFolderContents(list, root);
	}

	private renderFolderContents(
		parent: HTMLElement,
		folder: FolderNode
	): void {
		// Render folders first
		for (const childFolder of folder.folders) {
			const item = parent.createEl("li", {
				cls: "folder-view-folder",
			});

			const header = item.createDiv({
				cls: "folder-view-folder-header",
			});

			this.iconService.renderFolderIcon(header);

			header.createSpan({
				text: childFolder.name,
				cls: "folder-view-folder-name",
			});

			const childList = item.createEl("ul", {
				cls: "folder-view-folder-children",
			});

			this.renderFolderContents(childList, childFolder);
		}

		// Render files
		for (const fileNode of folder.files) {
			this.renderFile(parent, fileNode);
		}
	}

	private renderFile(parent: HTMLElement, fileNode: FileNode): void {
		const item = parent.createEl("li", {
			cls: "folder-view-file",
		});

		const link = item.createEl("a", {
			cls: "internal-link folder-view-file-link",
		});

		this.iconService.renderFileIcon(link, fileNode.file);

		link.createSpan({
			text: fileNode.displayName,
			cls: "folder-view-file-name",
		});

		link.addEventListener("click", (event) => {
			event.preventDefault();

			void this.app.workspace.openLinkText(
				fileNode.file.path,
				"",
				false
			);
		});
	}
}