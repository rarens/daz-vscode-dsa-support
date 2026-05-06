const fs = require('fs/promises');
const path = require('path');
const vscode = require('vscode');

async function getTargetWorkspaceFolder() {
	const folders = vscode.workspace.workspaceFolders || [];

	if (folders.length === 0) {
		vscode.window.showWarningMessage('Open a workspace folder before adding a DAZ jsconfig.json file.');
		return undefined;
	}

	if (folders.length === 1) {
		return folders[0];
	}

	return vscode.window.showWorkspaceFolderPick({
		placeHolder: 'Select the workspace folder that should receive jsconfig.json'
	});
}

async function addWorkspaceJsConfig(context) {
	const folder = await getTargetWorkspaceFolder();
	if (!folder) {
		return;
	}

	const targetPath = path.join(folder.uri.fsPath, 'jsconfig.json');
	const templatePath = path.join(context.extensionPath, 'templates', 'jsconfig.json');

	try {
		await fs.access(targetPath);
		const action = await vscode.window.showWarningMessage(
			'jsconfig.json already exists in this workspace folder.',
			{ modal: true },
			'Open Existing'
		);

		if (action === 'Open Existing') {
			const document = await vscode.workspace.openTextDocument(targetPath);
			await vscode.window.showTextDocument(document);
		}

		return;
	} catch (_error) {
		// Missing target file is the expected path.
	}

	const templateContent = await fs.readFile(templatePath, 'utf8');
	await fs.writeFile(targetPath, templateContent, 'utf8');

	const document = await vscode.workspace.openTextDocument(targetPath);
	await vscode.window.showTextDocument(document);
	await vscode.commands.executeCommand('typescript.restartTsServer');

	vscode.window.showInformationMessage('Added DAZ jsconfig.json to the workspace and restarted the TypeScript server.');
}

function activate(context) {
	const addJsConfigCommand = vscode.commands.registerCommand(
		'dsaSupport.addWorkspaceJsConfig',
		async () => addWorkspaceJsConfig(context)
	);

	const restartCommand = vscode.commands.registerCommand(
		'dsaSupport.restartTypeScriptServer',
		async () => {
			await vscode.commands.executeCommand('typescript.restartTsServer');
			vscode.window.showInformationMessage('TypeScript server restarted for DAZ Script support.');
		}
	);

	context.subscriptions.push(addJsConfigCommand, restartCommand);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate,
};