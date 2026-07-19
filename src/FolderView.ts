import { App, TFile } from "obsidian";
import { FolderTree } from "./FolderTree";
import { TreeRenderer } from "./TreeRenderer";

export class FolderView {
	private readonly folderTree: FolderTree;
	private readonly treeRenderer: TreeRenderer;

	constructor(private readonly app: App) {
		this.folderTree = new FolderTree();
		this.treeRenderer = new TreeRenderer(app);
	}

	render(container: HTMLElement, folderPath: string): void {
		const files = this.getFilesInFolder(folderPath);

		const tree = this.folderTree.build(files, folderPath);

		this.treeRenderer.render(container, tree);
	}

	private getFilesInFolder(folderPath: string): TFile[] {
		return this.app.vault
			.getFiles()
			.filter(
				(file) =>
					file.path === folderPath ||
					file.path.startsWith(folderPath + "/")
			);
	}
}
