import { setIcon, TFile } from "obsidian";
import { FolderViewSettings } from "./Settings";

export class IconService {
	private folderIcon = "folder";
	private defaultFileIcon = "file";
	private fileIconOverrides = new Map<string, string>();

	configure(settings: FolderViewSettings): void {
		this.folderIcon = settings.folderIcon || "folder";
		this.defaultFileIcon = settings.defaultFileIcon || "file";
		this.fileIconOverrides = this.parseOverrides(
			settings.fileIconOverrides
		);
	}

	renderFolderIcon(container: HTMLElement): void {
		this.renderIcon(container, this.folderIcon, "folder");
	}

	renderFileIcon(container: HTMLElement, file: TFile): void {
		this.renderIcon(
			container,
			this.getFileIcon(file),
			this.defaultFileIcon
		);
	}

	renderChevronIcon(container: HTMLElement): HTMLElement {
		return this.renderIcon(container, "chevron-down", "chevron-down");
	}

	private renderIcon(
		container: HTMLElement,
		iconName: string,
		fallbackIcon: string
	): HTMLElement {
		const icon = container.createSpan({
			cls: "folder-view-icon",
		});

		setIcon(icon, iconName);
		if (icon.childElementCount === 0 && iconName !== fallbackIcon) {
			setIcon(icon, fallbackIcon);
		}
		if (icon.childElementCount === 0 && fallbackIcon !== "file") {
			setIcon(icon, "file");
		}

		return icon;
	}

	private getFileIcon(file: TFile): string {
		const extension = file.extension.toLowerCase();
		const override = this.fileIconOverrides.get(extension);

		if (override !== undefined) {
			return override;
		}

		switch (extension) {
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
				return this.defaultFileIcon;
		}
	}

	private parseOverrides(value: string): Map<string, string> {
		const overrides = new Map<string, string>();

		for (const line of value.split(/\r?\n/)) {
			const separatorIndex = line.indexOf(":");
			if (separatorIndex < 0) {
				continue;
			}

			const extension = line
				.slice(0, separatorIndex)
				.trim()
				.replace(/^\./, "")
				.toLowerCase();
			const iconName = line.slice(separatorIndex + 1).trim();

			if (extension.length > 0 && iconName.length > 0) {
				overrides.set(extension, iconName);
			}
		}

		return overrides;
	}
}
