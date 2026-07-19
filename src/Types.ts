import { TFile } from "obsidian";

/**
 * Represents a file in the folder tree.
 * This wraps Obsidian's TFile so we can attach additional
 * UI-related information in the future without modifying
 * the renderer.
 */
export interface FileNode {
	/**
	 * The underlying Obsidian file.
	 */
	file: TFile;

	/**
	 * Text displayed to the user.
	 * Markdown files omit the ".md" extension.
	 */
	displayName: string;
}

/**
 * Represents a folder in the tree.
 *
 * The root folder is also represented by a FolderNode.
 */
export interface FolderNode {
	/**
	 * Folder name only.
	 */
	name: string;

	/**
	 * Full vault path.
	 * Example:
	 * "Projects"
	 * "Projects/Plugin"
	 */
	path: string;

	/**
	 * Child folders.
	 */
	folders: FolderNode[];

	/**
	 * Files directly inside this folder.
	 */
	files: FileNode[];
}