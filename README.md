# DAZ Script Support

VS Code support for DAZ Script files.

This extension adds:

- file association for `.dsa`
- syntax highlighting for DAZ Script files
- TypeScript-powered IntelliSense for bundled DAZ Studio type definitions
- a command to create a recommended `jsconfig.json` in your workspace

## Install

1. Install the extension.
2. Open your DAZ Script workspace in VS Code.
3. Run `DAZ Script: Add DAZ jsconfig.json to Workspace` from the Command Palette.
4. Run `DAZ Script: Restart TypeScript Server`.
5. Reopen your `.dsa` file if needed.

## Recommended jsconfig.json

If your workspace does not already have a `jsconfig.json`, the extension can create one for you.

Recommended contents:

```json
{
	"compilerOptions": {
		"allowJs": true,
		"checkJs": true,
		"target": "es5",
		"module": "none",
		"lib": ["ES5"],
		"skipLibCheck": true,
		"strict": false,
		"allowArbitraryExtensions": true
	},
	"include": [
		"./*.js",
		"./*.dsa",
		"./**/*.js",
		"./**/*.dsa",
		"./types/**/*.d.ts"
	],
	"exclude": [
		"./Docs/**/*.*",
		"./ResourceDump/**/*.*",
		"./node_modules/**/"
	]
}
```

## Commands

- `DAZ Script: Add DAZ jsconfig.json to Workspace`
- `DAZ Script: Restart TypeScript Server`

## Notes

- The extension bundles DAZ declaration files so IntelliSense does not depend on a separate npm package.
- If a workspace already has a `jsconfig.json`, the add command will not overwrite it.
- If IntelliSense does not refresh immediately, reload the window after adding the workspace config.