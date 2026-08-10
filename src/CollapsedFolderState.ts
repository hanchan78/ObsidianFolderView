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

		const data: FolderViewData = {
			collapsedFolders: [...this.collapsedFolders],
		};

		this.saveQueue = this.saveQueue.then(() => this.save(data));
	}
}
