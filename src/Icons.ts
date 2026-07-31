import { setIcon, TFile } from "obsidian";

export class IconService {
	renderFolderIcon(container: HTMLElement): void {
		this.renderIcon(container, "folder");
	}

	renderFileIcon(container: HTMLElement, file: TFile): void {
		this.renderIcon(container, this.getFileIcon(file));
	}

	renderChevronIcon(container: HTMLElement): HTMLElement {
		return this.renderIcon(container, "chevron-down");
	}

	private renderIcon(container: HTMLElement, iconName: string): HTMLElement {
		const icon = container.createSpan({
			cls: "folder-view-icon",
		});

		setIcon(icon, iconName);

		return icon;
	}

	private getFileIcon(file: TFile): string {
		switch (file.extension.toLowerCase()) {
			case "md":
			case "pdf":
			case "doc":
			case "docx":
				return "file-text";

			case "png":
			case "jpg":
			case "jpeg":
			case "gif":
			case "svg":
			case "webp":
				return "image";

			case "mp4":
			case "mkv":
			case "avi":
			case "mov":
				return "film";

			case "mp3":
			case "wav":
			case "ogg":
			case "flac":
				return "music";

			case "xls":
			case "xlsx":
				return "sheet";

			case "ppt":
			case "pptx":
				return "presentation";

			case "canvas":
				return "layout-dashboard";

			case "excalidraw":
				return "pen-tool";

			case "zip":
			case "7z":
			case "rar":
				return "archive";

			default:
				return "file";
		}
	}
}
