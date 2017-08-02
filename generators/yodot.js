const Generator = require('yeoman-generator');
const _ = require('lodash');
const glob = require('glob');
const path = require('path');

module.exports = class extends Generator {
	constructor(...args) {
		super(...args);
		this.ctx = {};
		this.manifest = {};
	}

	paths({ ns }) {
		const templatePath = this.templatePath(ns);

		this.allFiles = glob.sync(this.templatePath(ns, '**'), { dot: true, nodir: true })
			.map((file) => makeRelative(file, templatePath));
		this.templateFiles = glob.sync(this.templatePath(ns, '**/_*'), { nodir: true })
			.map((file) => makeRelative(file, templatePath));
		this.staticFiles = _.difference(this.allFiles, this.templateFiles);
	}

	write({ ns, mappings }) {
		this.manifest[ns] = [];

		for (const file of this.staticFiles) {
			this.manifest[ns].push(file);

			if (ns !== 'core' && this.manifest.core.includes(file)) {
				const content = this.fs.read(this.templatePath(ns, file));
				this.fs.append(this.destinationPath(file), content);
				continue;
			}

			this.fs.copy(
				this.templatePath(ns, file),
				this.destinationPath(file)
			);

			if (/\.gitkeep$/.test(file)) this.fs.delete(this.destinationPath(file));
		}

		for (const file of this.templateFiles) {
			let fixedFile = fixTemplatePath(file);
			if (mappings && _.has(mappings, fixedFile)) fixedFile = mappings[fixedFile];
			this.manifest[ns].push(fixedFile);

			if (ns !== 'core' && this.manifest.core.includes(fixedFile)) {
				const content = this.fs.read(this.templatePath(ns, file));
				this.fs.append(this.destinationPath(fixedFile), _.template(content)(this.ctx));
				continue;
			}

			this.fs.copyTpl(
				this.templatePath(ns, file),
				this.destinationPath(fixedFile),
				this.ctx
			);
		}
	}

	main(options = {}) {
		_.defaults(options, { ns: 'core' });
		this.paths(options);
		this.write(options);
	}
};

function fixTemplatePath(file) {
	const parts = file.split('/');
	parts[parts.length - 1] = _.last(parts).slice(1);
	return parts.join('/');
}

function makeRelative(file, templatePath) {
	return file.replace(`${templatePath}/`, '');
}
