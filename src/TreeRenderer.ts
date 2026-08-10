import { App } from "obsidian";
import { CollapsedFolderState } from "./CollapsedFolderState";
import { IconService } from "./Icons";
import { TreeFilter } from "./TreeFilter";
import { FileNode, FolderNode } from "./Types";
import { FolderViewSettings, ItemOrder } from "./Settings";

export class TreeRenderer {
	private readonly iconService: IconService;
	private readonly treeFilter: TreeFilter;

	constructor(
		private readonly app: App,
		private readonly collapsedFolderState: CollapsedFolderState
	) {
		this.iconService = new IconService();
		this.treeFilter = new TreeFilter();
	}

	render(
		container: HTMLElement,
		root: FolderNode,
		searchQuery: string,
		onSearchQueryChange: (query: string) => void,
		settings: FolderViewSettings,
		activeFilePath: string | null
	): void {
		container.empty();
		this.iconService.configure(settings);

		const searchInput = container.createEl("input", {
			cls: "folder-view-search",
			attr: {
				type: "search",
				placeholder: "Filter files and folders",
				"aria-label": "Filter files and folders",
			},
		});
		searchInput.value = searchQuery;

		const list = container.createEl("ul", {
			cls: "folder-view-tree",
		});

		const renderResults = (query: string): void => {
			list.empty();
			const filteredRoot = this.treeFilter.filter(root, query);
			const isFiltering = query.trim().length > 0;

			if (
				isFiltering &&
				filteredRoot.files.length === 0 &&
				filteredRoot.folders.length === 0
			) {
				list.createEl("li", {
					text: "No matching files or folders.",
					cls: "folder-view-empty-message",
				});
				return;
			}

			this.renderFolderContents(
				list,
				filteredRoot,
				isFiltering,
				settings.itemOrder,
				activeFilePath
			);
		};

		searchInput.addEventListener("input", () => {
			onSearchQueryChange(searchInput.value);
			renderResults(searchInput.value);
		});

		renderResults(searchQuery);
	}

	highlightFile(
		container: HTMLElement,
		activeFilePath: string | null
	): void {
		const fileItems = container.querySelectorAll<HTMLElement>(
			".folder-view-file[data-path]"
		);

		fileItems.forEach((item) => {
			item.toggleClass(
				"is-active",
				activeFilePath !== null &&
					item.dataset.path === activeFilePath
			);
		});
	}

	renderMissingFolder(container: HTMLElement, folderPath: string): void {
		container.empty();
		container.createDiv({
			text: `Folder not found: ${folderPath}`,
			cls: "folder-view-empty-message",
		});
	}

	private renderFolderContents(
		parent: HTMLElement,
		folder: FolderNode,
		expandAll: boolean,
		itemOrder: ItemOrder,
		activeFilePath: string | null
	): void {
		if (itemOrder === "files-first") {
			this.renderFiles(parent, folder.files, activeFilePath);
			this.renderFolders(parent, folder.folders, expandAll, itemOrder, activeFilePath);
		} else {
			this.renderFolders(parent, folder.folders, expandAll, itemOrder, activeFilePath);
			this.renderFiles(parent, folder.files, activeFilePath);
		}
	}

	private renderFolders(
		parent: HTMLElement,
		folders: FolderNode[],
		expandAll: boolean,
		itemOrder: ItemOrder,
		activeFilePath: string | null
	): void {
		for (const childFolder of folders) {
			const isCollapsed =
				!expandAll &&
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

			this.renderFolderContents(
				childList,
				childFolder,
				expandAll,
				itemOrder,
				activeFilePath
			);

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
				if (!expandAll) {
					this.collapsedFolderState.setCollapsed(
						childFolder.path,
						!nextExpanded
					);
				}
			});
		}
	}

	private renderFiles(
		parent: HTMLElement,
		files: FileNode[],
		activeFilePath: string | null
	): void {
		for (const fileNode of files) {
			this.renderFile(parent, fileNode, activeFilePath);
		}
	}

	private renderFile(
		parent: HTMLElement,
		fileNode: FileNode,
		activeFilePath: string | null
	): void {
		const item = parent.createEl("li", {
			cls: "folder-view-file",
			attr: {
				"data-path": fileNode.file.path,
			},
		});
		item.toggleClass("is-active", fileNode.file.path === activeFilePath);

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
