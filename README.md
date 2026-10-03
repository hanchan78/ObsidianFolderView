# FolderView

FolderView is an Obsidian community plugin that renders a folder tree directly inside your notes using a Markdown code block.

Unlike Dataview, FolderView is designed specifically for browsing folders and files. It displays the contents of any folder in your vault as a tree, including subfolders and non-Markdown files.

> **Note:** FolderView is preparing for its first Community Plugin release.

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
<Your Vault>/.obsidian/plugins/folder-view/
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

For a manual release installation, copy `main.js`, `manifest.json`, and
`styles.css` into the same `folder-view` directory.

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

## Settings

Open **Settings → FolderView** to configure:

* Sort direction and whether files or folders appear first.
* Whether non-Markdown file extensions are displayed.
* Folder and fallback file icons.
* Extension-specific icon overrides using Obsidian icon names.

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

### Release validation

Run the complete release check before committing or pushing an update. This
runs lint, builds the production `main.js` at the repository root, and validates
the release files and version metadata:

```bash
npm run check
```

### Publishing for Git Installer & Updater

Configure the updater with repository `hanchan78/ObsidianFolderView`, branch
`main`, and the built-files directory set to the repository root. It compares
`manifest.json` versions and downloads `main.js` and `styles.css` from the same
commit. It does not build TypeScript or download GitHub release assets.

Before each update:

1. Set a version newer than the installed version in `manifest.json` and keep
   `package.json`, `package-lock.json`, and `versions.json` consistent. Version
   `1.0.2` updates an installation running `1.0.1`.
2. Stop any development watcher and run `npm run check`. Rebuild if you change
   source afterward; publish the production bundle, without inline sourcemaps.
3. Commit the freshly built root `main.js`, `manifest.json`, and `styles.css`
   together with the source and version metadata. Keep `node_modules/` and
   sourcemaps out of Git.
4. Push that commit to `main`, then run the updater on the phone and reload
   Obsidian to load the new plugin version.

The compiled files must be committed before pushing. Uploading release assets
alone will not make an update available to this updater.

Create a GitHub release whose tag exactly matches the version in
`manifest.json` without a leading `v`. Attach `main.js`, `manifest.json`,
and `styles.css` as individual release assets.
