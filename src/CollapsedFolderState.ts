export interface FolderViewData {
	collapsedFolders: string[];
}

export class CollapsedFolderState {
	private readonly collapsedFolders: Set<string>;
	private saveQueue: Promise<void> = Promise.resolve();

	constructor(
		collapsedFolders: Iterable<string>,
		private readonly save: (data: FolderViewData) => Promise<void>
	) {
		this.collapsedFolders = new Set(collapsedFolders);
	}

	isCollapsed(folderPath: string): boolean {
		return this.collapsedFolders.has(folderPath);
	}

	getCollapsedFolders(): string[] {
		return [...this.collapsedFolders];
	}

	setCollapsed(folderPath: string, collapsed: boolean): void {
		if (collapsed) {
			this.collapsedFolders.add(folderPath);
		} else {
			this.collapsedFolders.delete(folderPath);
		}

		this.queueSave();
	}

	renameFolder(oldPath: string, newPath: string): void {
		const oldPrefix = `${oldPath}/`;
		let changed = false;

		for (const folderPath of [...this.collapsedFolders]) {
			if (folderPath !== oldPath && !folderPath.startsWith(oldPrefix)) {
				continue;
			}

			this.collapsedFolders.delete(folderPath);
			this.collapsedFolders.add(
				newPath + folderPath.slice(oldPath.length)
			);
			changed = true;
		}

		if (changed) {
			this.queueSave();
		}
	}

	private queueSave(): void {
		const data: FolderViewData = {
			collapsedFolders: [...this.collapsedFolders],
		};

		this.saveQueue = this.saveQueue.then(() => this.save(data));
	}
}
