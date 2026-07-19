import { TFile } from "obsidian";
import { FileNode, FolderNode } from "./Types";

export class FolderTree {
	build(files: TFile[], rootPath: string): FolderNode {
		const root: FolderNode = {
			name: this.getFolderName(rootPath),
			path: rootPath,
			folders: [],
			files: [],
		};

		for (const file of files) {
			const relativePath = file.path
				.slice(rootPath.length)
				.replace(/^\/+/, "");

			if (relativePath.length === 0) {
				continue;
			}

			const parts = relativePath.split("/");
			const fileName = parts.pop();

			if (fileName === undefined) {
				continue;
			}

			let currentFolder: FolderNode = root;

			for (const part of parts) {
				let childFolder: FolderNode | undefined =
					currentFolder.folders.find(
						(folder) => folder.name === part
					);

				if (childFolder === undefined) {
					const folderPath =
						currentFolder.path.length === 0
							? part
							: `${currentFolder.path}/${part}`;

					childFolder = {
						name: part,
						path: folderPath,
						folders: [],
						files: [],
					};

					currentFolder.folders.push(childFolder);
				}

				currentFolder = childFolder;
			}

			currentFolder.files.push(this.createFileNode(file));
		}

		this.sortTree(root);

		return root;
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