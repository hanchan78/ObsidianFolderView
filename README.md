# FolderView

FolderView is an Obsidian community plugin that renders a folder tree directly inside your notes using a Markdown code block.

Unlike Dataview, FolderView is designed specifically for browsing folders and files. It displays the contents of any folder in your vault as a tree, including subfolders and non-Markdown files.

> **Note:** This plugin is currently under active development. More features will be added over time.

---

## Features

Current features:

* Display every file in a folder.
* Recursively include all subfolders.
* Display empty folders.
* Show **all file types**, not just Markdown notes.
* Display Markdown notes without the `.md` extension.
* Optionally display extensions for files other than Markdown notes.
* Choose whether files or subfolders appear first at every level.
* Sort files and subfolders from A to Z or Z to A within their groups.
* Collapse and expand folders with the mouse or keyboard.
* Remember collapsed folders across notes, plugin reloads, and Obsidian restarts.
* Preserve collapsed state when folders are renamed or moved.
* Use native Obsidian icons for folders and common file types.
* Customize folder, fallback file, and extension-specific icons.
* Click any file to open it just like a normal internal Obsidian link.
* Preview a file by hovering over its filename when Obsidian's page preview feature is enabled.
* Update rendered trees when files or folders are created, renamed, moved, or deleted.
* Filter files and folders within each rendered tree.
* Highlight the currently active note.
* Support desktop and mobile layouts with touch-friendly controls.

---

## Installation (Development)

Clone or download this repository into your vault's plugins folder:

```
<Your Vault>/.obsidian/plugins/FolderView/
```

Install dependencies:

```bash
npm install
```

Start the development build:

```bash
npm run dev
```

Enable the plugin in:

**Settings → Community Plugins**

---

## Usage

Insert the following code block into any note:

````markdown
```folderview
Projects
```
````

Where `Projects` is the path to a folder in your vault.

FolderView will render a tree containing every file and subfolder beneath that folder.

Example:

````markdown
```folderview
Projects
```
````

Produces something similar to:

```
Ideas
Meeting Notes
Todo

Personal
    Shopping
    Vacation

Work
    Proposal
    Budget.xlsx
```

Markdown notes are displayed without the `.md` extension.

Other files keep their extensions.

Clicking any file opens it in Obsidian.

Select a folder row to collapse or expand its contents. FolderView remembers this state globally by full vault path. If the same folder appears in multiple FolderView blocks, it uses the same collapsed or expanded state in each one.

---

## Folder Paths

Paths are relative to the root of your vault.

Examples:

````markdown
```folderview
Projects
```

```folderview
Projects/Work
```

```folderview
Attachments
```
````

---

## Current Limitations

At the current stage of development:

* The tree is rebuilt when rendered.

These limitations will be addressed in future releases.

---

## Planned Features

The following features are planned:

* Community Plugin release

---

## Development

FolderView is written in TypeScript using the official Obsidian Plugin API.

The project is organized into focused classes:

```
src/
├── CollapsedFolderState.ts
├── main.ts
├── FolderView.ts
├── FolderTree.ts
├── TreeRenderer.ts
├── Icons.ts
└── Types.ts
```

The project aims to follow clean architecture principles:

* Single responsibility for each class
* Strong TypeScript typing
* Minimal logic in `main.ts`
* Use of Obsidian APIs wherever possible
* Easy to extend and maintain

Contributions, suggestions, and bug reports are welcome.
