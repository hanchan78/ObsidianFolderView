import { FolderNode } from "./Types";

export class TreeFilter {
	filter(root: FolderNode, query: string): FolderNode {
		const normalizedQuery = query.trim().toLocaleLowerCase();

		if (normalizedQuery.length === 0) {
			return root;
		}

		return {
			...root,
			files: root.files.filter((file) =>
				this.matches(file.displayName, normalizedQuery)
			),
			folders: this.filterFolders(root.folders, normalizedQuery),
		};
	}

	private filterFolders(
		folders: FolderNode[],
		normalizedQuery: string
	): FolderNode[] {
		const matches: FolderNode[] = [];

		for (const folder of folders) {
			const filteredFolder = this.filterFolder(folder, normalizedQuery);

			if (filteredFolder !== null) {
				matches.push(filteredFolder);
			}
		}

		return matches;
	}

	private filterFolder(
		folder: FolderNode,
		normalizedQuery: string
	): FolderNode | null {
		if (this.matches(folder.name, normalizedQuery)) {
			return folder;
		}

		const files = folder.files.filter((file) =>
			this.matches(file.displayName, normalizedQuery)
		);
		const folders = this.filterFolders(folder.folders, normalizedQuery);

		if (files.length === 0 && folders.length === 0) {
			return null;
		}

		return {
			...folder,
			files,
			folders,
		};
	}

	private matches(value: string, normalizedQuery: string): boolean {
		return value.toLocaleLowerCase().includes(normalizedQuery);
	}
}
