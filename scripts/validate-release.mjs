import { access, readFile } from "node:fs/promises";
import process from "node:process";

const manifest = JSON.parse(await readFile("manifest.json", "utf8"));
const packageData = JSON.parse(await readFile("package.json", "utf8"));
const versions = JSON.parse(await readFile("versions.json", "utf8"));

const errors = [];

if (!/^[a-z-]+$/.test(manifest.id)) {
	errors.push("manifest id must contain only lowercase letters and hyphens");
}
if (manifest.id.includes("obsidian") || manifest.id.endsWith("plugin")) {
	errors.push("manifest id cannot contain obsidian or end with plugin");
}
if (manifest.version !== packageData.version) {
	errors.push("manifest and package versions must match");
}
if (versions[manifest.version] !== manifest.minAppVersion) {
	errors.push("versions.json must map the release to minAppVersion");
}

for (const artifact of ["main.js", "manifest.json", "styles.css"]) {
	try {
		await access(artifact);
	} catch {
		errors.push(`missing release artifact: ${artifact}`);
	}
}

if (errors.length > 0) {
	for (const error of errors) {
		console.error(`- ${error}`);
	}
	process.exitCode = 1;
} else {
	console.log(`Release ${manifest.version} is ready for packaging.`);
}
