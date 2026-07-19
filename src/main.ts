import { MarkdownPostProcessorContext, Plugin } from "obsidian";
import { FolderView } from "./FolderView";

export default class FolderViewPlugin extends Plugin {
	private folderView!: FolderView;

	async onload(): Promise<void> {
		this.folderView = new FolderView(this.app);

		this.registerMarkdownCodeBlockProcessor(
			"folderview",
			async (
				source: string,
				el: HTMLElement,
				_ctx: MarkdownPostProcessorContext
			) => {
				const folderPath = source.trim();

				this.folderView.render(el, folderPath);
			}
		);
	}
}
