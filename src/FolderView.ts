import { App, MarkdownRenderChild, TFolder } from "obsidian";
import { CollapsedFolderState } from "./CollapsedFolderState";
import { FolderTree } from "./FolderTree";
import { TreeRenderer } from "./TreeRenderer";

export class FolderView {
	private readonly folderTree: FolderTree;
	private readonly treeRenderer: TreeRenderer;
	private readonly renderedViews = new Set<FolderViewRenderChild>();

	constructor(
		private readonly app: App,
		collapsedFolderState: CollapsedFolderState
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
			(path) => this.render(container, path),
			(view) => this.renderedViews.add(view),
			(view) => this.renderedViews.delete(view)
		);
	}

	handleVaultChanges(...changedPaths: string[]): void {
		for (const view of this.renderedViews) {
			view.refreshIfAffected(changedPaths);
		}
	}

	private render(container: HTMLElement, folderPath: string): void {
		const folder = this.getFolder(folderPath);
		const tree = this.folderTree.build(folder, folderPath);

		this.treeRenderer.render(container, tree);
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

	constructor(
		container: HTMLElement,
		private readonly folderPath: string,
		private readonly renderView: (folderPath: string) => void,
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
		this.renderView(this.folderPath);
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
			this.renderView(this.folderPath);
		}, 100);
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
