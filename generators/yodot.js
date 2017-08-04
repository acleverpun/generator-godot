const Generator = require('yeoman-generator');
const _ = require('lodash');
const glob = require('glob');
const shell = require('shelljs');

module.exports = class extends Generator {
	constructor(...args) {
		super(...args);
		this.ctx = {};
	}

	paths({ ns }) {
		const templatePath = this.templatePath(ns);

		this.allFiles = glob.sync(this.templatePath(ns, '**'), { dot: true, nodir: true })
			.map((file) => makeRelative(file, templatePath));
		this.templateFiles = glob.sync(this.templatePath(ns, '**/_[^_]*'), { nodir: true })
			.map((file) => makeRelative(file, templatePath));
		this.transformFiles = glob.sync(this.templatePath(ns, '**/__*.js?(on)'), { nodir: true })
			.map((file) => makeRelative(file, templatePath));
		this.staticFiles = _.difference(this.allFiles, this.templateFiles, this.transformFiles);
	}

	write({ ns, mappings }) {
		for (const file of this.staticFiles) {
			this.fs.copy(
				this.templatePath(ns, file),
				this.destinationPath(file)
			);

			if (/\.gitkeep$/.test(file)) this.fs.delete(this.destinationPath(file));
		}

		for (const file of this.templateFiles) {
			let fixedFile = fixTemplatePath(file);
			if (mappings && _.has(mappings, fixedFile)) fixedFile = mappings[fixedFile];

			this.fs.copyTpl(
				this.templatePath(ns, file),
				this.destinationPath(fixedFile),
				this.ctx
			);
		}

		for (const file of this.transformFiles) {
			let fixedFile = fixTemplatePath(file);
			let transform = require(this.templatePath(ns, file));
			if (typeof transform === 'function') transform = transform(this.ctx);

			if (transform.action === 'append') {
				this.fs.append(this.destinationPath(fixedFile), _.template(transform.body)(this.ctx));
			}
		}
	}

	getModules(includeCore = false) {
		let modules = shell.ls(this.templatePath());
		if (!includeCore) _.pull(modules, 'core');
		return modules;
	}

	main(options = {}) {
		_.defaults(options, { ns: 'core' });
		this.paths(options);
		this.write(options);
	}
};

function fixTemplatePath(filePath) {
	const parts = filePath.split('/');
	let file = _.last(parts);
	if (/^__/.test(file)) file = file.replace(/\.js(on)?$/, '');
	parts[parts.length - 1] = file.replace(/^__?/, '');
	return parts.join('/');
}

function makeRelative(filePath, templatePath) {
	return filePath.replace(`${templatePath}/`, '');
}
