import { App, MarkdownRenderChild, TFolder } from "obsidian";
import { CollapsedFolderState } from "./CollapsedFolderState";
import { FolderTree } from "./FolderTree";
import { TreeRenderer } from "./TreeRenderer";
import { FolderViewSettings } from "./Settings";

export class FolderView {
	private readonly folderTree: FolderTree;
	private readonly treeRenderer: TreeRenderer;
	private readonly renderedViews = new Set<FolderViewRenderChild>();

	constructor(
		private readonly app: App,
		collapsedFolderState: CollapsedFolderState,
		private settings: FolderViewSettings
	) {
		this.folderTree = new FolderTree();
		this.treeRenderer = new TreeRenderer(
			app,
			collapsedFolderState
		);
	}

	createRenderChild(
		container: HTMLElement,
		folderPath: string
	): MarkdownRenderChild {
		return new FolderViewRenderChild(
			container,
			this.normalizePath(folderPath),
			(path, query, onQueryChange) =>
				this.render(container, path, query, onQueryChange),
			(view) => this.renderedViews.add(view),
			(view) => this.renderedViews.delete(view)
		);
	}

	handleVaultChanges(...changedPaths: string[]): void {
		for (const view of this.renderedViews) {
			view.refreshIfAffected(changedPaths);
		}
	}

	updateSettings(settings: FolderViewSettings): void {
		this.settings = settings;

		for (const view of this.renderedViews) {
			view.refresh();
		}
	}

	private render(
		container: HTMLElement,
		folderPath: string,
		searchQuery: string,
		onSearchQueryChange: (query: string) => void
	): void {
		const folder = this.getFolder(folderPath);

		if (folder === null) {
			this.treeRenderer.renderMissingFolder(container, folderPath);
			return;
		}

		const tree = this.folderTree.build(
			folder,
			folderPath,
			this.settings.sortDirection,
			this.settings.showFileExtensions
		);

		this.treeRenderer.render(
			container,
			tree,
			searchQuery,
			onSearchQueryChange,
			this.settings
		);
	}

	private getFolder(folderPath: string): TFolder | null {
		if (folderPath.length === 0) {
			return this.app.vault.getRoot();
		}

		const abstractFile =
			this.app.vault.getAbstractFileByPath(folderPath);

		return abstractFile instanceof TFolder ? abstractFile : null;
	}

	private normalizePath(path: string): string {
		return path.trim().replace(/^\/+|\/+$/g, "");
	}
}

class FolderViewRenderChild extends MarkdownRenderChild {
	private refreshTimer: number | undefined;
	private searchQuery = "";

	constructor(
		container: HTMLElement,
		private readonly folderPath: string,
		private readonly renderView: (
			folderPath: string,
			searchQuery: string,
			onSearchQueryChange: (query: string) => void
		) => void,
		private readonly registerView: (
			view: FolderViewRenderChild
		) => void,
		private readonly unregisterView: (
			view: FolderViewRenderChild
		) => void
	) {
		super(container);
	}

	onload(): void {
		this.registerView(this);
		this.render();
	}

	onunload(): void {
		this.unregisterView(this);

		if (this.refreshTimer !== undefined) {
			window.clearTimeout(this.refreshTimer);
		}
	}

	refreshIfAffected(changedPaths: string[]): void {
		if (!changedPaths.some((path) => this.isAffectedBy(path))) {
			return;
		}

		if (this.refreshTimer !== undefined) {
			window.clearTimeout(this.refreshTimer);
		}

		this.refreshTimer = window.setTimeout(() => {
			this.refreshTimer = undefined;
			this.render();
		}, 100);
	}

	refresh(): void {
		this.render();
	}

	private render(): void {
		this.renderView(
			this.folderPath,
			this.searchQuery,
			(query) => {
				this.searchQuery = query;
			}
		);
	}

	private isAffectedBy(changedPath: string): boolean {
		if (this.folderPath.length === 0) {
			return true;
		}

		return (
			changedPath === this.folderPath ||
			changedPath.startsWith(`${this.folderPath}/`) ||
			this.folderPath.startsWith(`${changedPath}/`)
		);
	}
}
