import { TFile, TFolder } from "obsidian";
import { FileNode, FolderNode } from "./Types";
import { SortDirection } from "./Settings";

export class FolderTree {
	build(
		folder: TFolder | null,
		rootPath: string,
		sortDirection: SortDirection,
		showFileExtensions: boolean
	): FolderNode {
		const root: FolderNode = {
			name: this.getFolderName(rootPath),
			path: rootPath,
			folders: [],
			files: [],
		};

		if (folder !== null) {
			this.addChildren(root, folder, showFileExtensions);
		}

		this.sortTree(root, sortDirection);

		return root;
	}

	private addChildren(
		node: FolderNode,
		folder: TFolder,
		showFileExtensions: boolean
	): void {
		for (const child of folder.children) {
			if (child instanceof TFile) {
				node.files.push(
					this.createFileNode(child, showFileExtensions)
				);
			} else if (child instanceof TFolder) {
				const childNode: FolderNode = {
					name: child.name,
					path: child.path,
					folders: [],
					files: [],
				};

				node.folders.push(childNode);
				this.addChildren(
					childNode,
					child,
					showFileExtensions
				);
			}
		}
	}

	private createFileNode(
		file: TFile,
		showFileExtensions: boolean
	): FileNode {
		return {
			file,
			displayName:
				file.extension === "md" || !showFileExtensions
					? file.basename
					: file.name,
		};
	}

	private sortTree(
		folder: FolderNode,
		sortDirection: SortDirection
	): void {
		const direction = sortDirection === "ascending" ? 1 : -1;

		folder.folders.sort((a, b) =>
			direction * a.name.localeCompare(b.name, undefined, {
				sensitivity: "base",
			})
		);

		folder.files.sort((a, b) =>
			direction * a.displayName.localeCompare(b.displayName, undefined, {
				sensitivity: "base",
			})
		);

		for (const childFolder of folder.folders) {
			this.sortTree(childFolder, sortDirection);
		}
	}

	private getFolderName(path: string): string {
		if (path.length === 0) {
			return "";
		}

		const parts = path.split("/");
		const folderName = parts[parts.length - 1];

		return folderName ?? "";
	}
}
