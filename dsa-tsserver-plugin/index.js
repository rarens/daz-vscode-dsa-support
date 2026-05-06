const path = require('path');

function init(modules) {
	const ts = modules.typescript;
	const bundledTypesEntry = path.resolve(__dirname, '..', 'types', 'index.d.ts');

	function log(project, message) {
		try {
			const logger = project && project.projectService && project.projectService.logger;
			if (logger && typeof logger.info === 'function') {
				logger.info('[dsa-tsserver-plugin] ' + message);
			}
		} catch (_error) {
			// Ignore plugin logging failures.
		}
	}

	function getProjectRoot(project) {
		if (project && typeof project.getCurrentDirectory === 'function') {
			return project.getCurrentDirectory();
		}

		if (project && typeof project.getProjectRootPath === 'function') {
			return project.getProjectRootPath();
		}

		return undefined;
	}

	function getExternalFiles(project) {
		try {
			const root = getProjectRoot(project);
			const host = project && project.projectService && project.projectService.host;
			const externalFiles = [];

			if (host && typeof host.fileExists === 'function' && host.fileExists(bundledTypesEntry)) {
				externalFiles.push(bundledTypesEntry);
			}

			if (!root || !host || typeof host.readDirectory !== 'function') {
				return externalFiles;
			}

			const files = host.readDirectory(root, ['.dsa'], undefined, undefined, 99) || [];
			log(project, 'discovered ' + files.length + ' DAZ Script files under ' + root);

			if (externalFiles.length > 0) {
				log(project, 'loaded bundled types from ' + bundledTypesEntry);
			}

			return externalFiles.concat(files);
		} catch (error) {
			log(project, 'failed to enumerate DAZ Script files: ' + String(error));
			return [];
		}
	}

	function create(info) {
		log(info.project, 'activated for project ' + info.project.getProjectName());
		return info.languageService;
	}

	return {
		create,
		getExternalFiles,
		extraFileExtensions: [
			{ extension: '.dsa', isMixedContent: false, scriptKind: ts.ScriptKind.JS }
		]
	};
}

module.exports = init;