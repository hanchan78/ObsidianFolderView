import { TFile } from "obsidian";

export class IconService {
	renderFolderIcon(container: HTMLElement): void {
		container.createSpan({
			text: "📁",
			cls: "folder-view-icon",
		});
	}

	renderFileIcon(container: HTMLElement, file: TFile): void {
		container.createSpan({
			text: this.getEmoji(file),
			cls: "folder-view-icon",
		});
	}

	private getEmoji(file: TFile): string {
		switch (file.extension.toLowerCase()) {
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
				return "📄";
		}
	}
}