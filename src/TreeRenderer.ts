import { App } from "obsidian";
import { CollapsedFolderState } from "./CollapsedFolderState";
import { IconService } from "./Icons";
import { FileNode, FolderNode } from "./Types";

export class TreeRenderer {
	private readonly iconService: IconService;

	constructor(
		private readonly app: App,
		private readonly collapsedFolderState: CollapsedFolderState
	) {
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
		for (const fileNode of folder.files) {
			this.renderFile(parent, fileNode);
		}

		for (const childFolder of folder.folders) {
			const isCollapsed =
				this.collapsedFolderState.isCollapsed(childFolder.path);
			const item = parent.createEl("li", {
				cls: "folder-view-folder",
			});

			const header = item.createEl("button", {
				cls: "folder-view-folder-header",
				attr: {
					type: "button",
					"aria-expanded": String(!isCollapsed),
				},
			});

			const chevron =
				this.iconService.renderChevronIcon(header);
			chevron.toggleClass("is-collapsed", isCollapsed);
			this.iconService.renderFolderIcon(header);

			header.createSpan({
				text: childFolder.name,
				cls: "folder-view-folder-name",
			});

			const childList = item.createEl("ul", {
				cls: "folder-view-folder-children",
			});
			childList.hidden = isCollapsed;

			this.renderFolderContents(childList, childFolder);

			header.addEventListener("click", () => {
				const isExpanded =
					header.getAttribute("aria-expanded") === "true";
				const nextExpanded = !isExpanded;

				header.setAttribute(
					"aria-expanded",
					String(nextExpanded)
				);
				childList.hidden = !nextExpanded;
				chevron.toggleClass(
					"is-collapsed",
					!nextExpanded
				);
				this.collapsedFolderState.setCollapsed(
					childFolder.path,
					!nextExpanded
				);
			});
		}
	}

	private renderFile(parent: HTMLElement, fileNode: FileNode): void {
		const item = parent.createEl("li", {
			cls: "folder-view-file",
		});

		this.iconService.renderFileIcon(item, fileNode.file);

		const link = item.createEl("a", {
			cls: "internal-link folder-view-file-link",
			attr: {
				href: fileNode.file.path,
				"data-href": fileNode.file.path,
			},
		});

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
