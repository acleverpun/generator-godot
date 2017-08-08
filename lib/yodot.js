const Generator = require('yeoman-generator');
const _ = require('lodash');
const glob = require('glob');
const ini = require('ezini');
const path = require('path');
const shell = require('shelljs');
const utils = require('./utils');

module.exports = class extends Generator {
	constructor(...args) {
		super(...args);
		this.ctx = {};
	}

	paths({ ns }) {
		const templatePath = this.templatePath(ns);

		this.allFiles = glob.sync(this.templatePath(ns, '**'), { dot: true, nodir: true })
			.map((file) => utils.makeRelative(file, templatePath));
		this.templateFiles = glob.sync(this.templatePath(ns, '**/_[^_]*'), { nodir: true })
			.map((file) => utils.makeRelative(file, templatePath));
		this.transformFiles = glob.sync(this.templatePath(ns, '**/__*.js?(on)'), { nodir: true })
			.map((file) => utils.makeRelative(file, templatePath));
		this.staticFiles = _.difference(this.allFiles, this.templateFiles, this.transformFiles);
	}

	write({ ns, mappings }) {
		// Handle static files
		for (const file of this.staticFiles) {
			this.fs.copy(
				this.templatePath(ns, file),
				this.destinationPath(file)
			);
		}

		// Handle template files
		for (const file of this.templateFiles) {
			let fixedFile = utils.fixTemplatePath(file);
			if (mappings && _.has(mappings, fixedFile)) fixedFile = mappings[fixedFile];

			this.fs.copyTpl(
				this.templatePath(ns, file),
				this.destinationPath(fixedFile),
				this.ctx
			);
		}

		// Handle transform files
		for (const file of this.transformFiles) {
			let fixedFile = utils.fixTemplatePath(file);
			let transform = require(this.templatePath(ns, file));
			let writeMethod = 'write';

			// Handle functions, passing ctx
			if (typeof transform === 'function') transform = transform(this.ctx, this);
			if (!transform) continue;

			// Set defaults
			if (!transform.action) transform.action = 'overwrite';
			let body = transform.body;

			// Handle renaming
			if (transform.name) {
				fixedFile = path.join(path.dirname(fixedFile), `${transform.name}${path.extname(fixedFile)}`);
			}
			let destPath = this.destinationPath(fixedFile);

			// Handle appinding
			if (transform.action === 'append' && this.fs.exists(destPath)) writeMethod = 'append';

			// Handle ini
			if (transform.type === 'ini') {
				if (this.fs.exists(destPath)) {
					const currentBody = ini.parseSync(this.fs.read(destPath));
					body = _.merge(currentBody, body);
				}
				body = ini.stringifySync(utils.fixIni(body));
			}

			// Write file
			this.fs[writeMethod](destPath, body);
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
