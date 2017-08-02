const Generator = require('yeoman-generator');
const _ = require('lodash');
const chalk = require('chalk');
const glob = require('glob');
const path = require('path');
const pkg = require('../../package.json');
const yosay = require('yosay');

module.exports = class extends Generator {
	init() {
		this.ctx = {};
		this.manifest = {};
	}

	greet() {
		this.log(yosay(`Welcome to the ${chalk.red(pkg.name)} generator!`));
	}


	async ask() {
		const answers = await this.prompt([ {
			name: 'name',
			type: 'input',
			message: 'Project name?',
			default: path.basename(process.cwd())
		}, {
			name: 'modules',
			type: 'checkbox',
			message: 'Modules?',
			choices: [ 'nim' ],
			store: true
		} ]);

		_.assign(this.ctx, answers);
	}

	paths(ns = 'core') {
		const templatePath = this.templatePath(ns);

		this.allFiles = glob.sync(this.templatePath(ns, '**'), { dot: true, nodir: true })
			.map((file) => makeRelative(file, templatePath));
		this.templateFiles = glob.sync(this.templatePath(ns, '**/_*'), { nodir: true })
			.map((file) => makeRelative(file, templatePath));
		this.staticFiles = _.difference(this.allFiles, this.templateFiles);
	}

	write(ns = 'core') {
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
		}

		for (const file of this.templateFiles) {
			const fixedFile = fixTemplatePath(file);
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

	modules() {
		for (const module of this.ctx.modules) {
			this.paths(module);
			this.write(module);
		}
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
