import { Plugin, MarkdownPostProcessorContext } from "obsidian";

export default class FolderViewPlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor(
			"folderview",
			async (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
				const root = source.trim();

				const files = this.app.vault
						.getFiles()
						.filter(f => f.path.startsWith(root + "/") || f.path === root);

				const tree = this.buildTree(files, root);

				el.empty();
				this.renderTree(el, tree);
			}
		);
	}

	buildTree(files: any[], root: string) {
		const tree: any = {};

		for (const file of files) {
			const relative = file.path.slice(root.length).replace(/^\/+/, "");
			if (!relative) continue;

			const parts = relative.split("/");
			let current = tree;

			for (let i = 0; i < parts.length; i++) {
				const part = parts[i];

				if (i === parts.length - 1) {
					current[part] = file;
				} else {
					current[part] ??= {};
					current = current[part];
				}
			}
		}

		return tree;
	}


	private getFileIcon(extension: string): string {
			switch (extension.toLowerCase()) {
					case "md":
							return "📝";

					case "pdf":
							return "📄";

					case "png":
					case "jpg":
					case "jpeg":
					case "gif":
					case "svg":
					case "webp":
							return "🖼️";

					case "mp4":
					case "mkv":
					case "avi":
					case "mov":
							return "🎬";

					case "mp3":
					case "wav":
					case "ogg":
					case "flac":
							return "🎵";

					case "doc":
					case "docx":
							return "📘";

					case "xls":
					case "xlsx":
							return "📊";

					case "ppt":
					case "pptx":
							return "📽️";

					case "canvas":
							return "🎨";

					case "excalidraw":
							return "✏️";

					case "zip":
					case "7z":
					case "rar":
							return "📦";

					default:
							return "📁";
			}
	}

	private getDisplayName(file: any): string {
			return file.extension === "md"
					? file.basename
					: file.name;
	}


	renderTree(container: HTMLElement, tree: any) {
		const ul = container.createEl("ul");

		for (const [name, value] of Object.entries(tree)) {
			const li = ul.createEl("li");

			if ("path" in (value as any)) {
				const file = value as any;
				const displayName =
						file.extension === "md"
								? file.basename
								: file.name;

				const link = li.createEl("a", {
						text: displayName,
						cls: "internal-link"
				});

				link.addEventListener("click", (evt) => {
						evt.preventDefault();
						this.app.workspace.openLinkText(file.path, "", false);
				});
			} else {
				li.createEl("strong", { text: `📁 ${name}` });
				this.renderTree(li, value);
			}
		}
	}
}