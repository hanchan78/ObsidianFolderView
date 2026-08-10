import { TFile, TFolder } from "obsidian";
import { FileNode, FolderNode } from "./Types";

export class FolderTree {
	build(folder: TFolder | null, rootPath: string): FolderNode {
		const root: FolderNode = {
			name: this.getFolderName(rootPath),
			path: rootPath,
			folders: [],
			files: [],
		};

		if (folder !== null) {
			this.addChildren(root, folder);
		}

		this.sortTree(root);

		return root;
	}

	private addChildren(node: FolderNode, folder: TFolder): void {
		for (const child of folder.children) {
			if (child instanceof TFile) {
				node.files.push(this.createFileNode(child));
			} else if (child instanceof TFolder) {
				const childNode: FolderNode = {
					name: child.name,
					path: child.path,
					folders: [],
					files: [],
				};

				node.folders.push(childNode);
				this.addChildren(childNode, child);
			}
		}
	}

	private createFileNode(file: TFile): FileNode {
		return {
			file,
			displayName:
				file.extension === "md"
					? file.basename
					: file.name,
		};
	}

	private sortTree(folder: FolderNode): void {
		folder.folders.sort((a, b) =>
			a.name.localeCompare(b.name, undefined, {
				sensitivity: "base",
			})
		);

		folder.files.sort((a, b) =>
			a.displayName.localeCompare(b.displayName, undefined, {
				sensitivity: "base",
			})
		);

		for (const childFolder of folder.folders) {
			this.sortTree(childFolder);
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
