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
		for (const file of this.staticFiles) {
			this.fs.copy(
				this.templatePath(ns, file),
				this.destinationPath(file)
			);
		}

		for (const file of this.templateFiles) {
			this.fs.copyTpl(
				this.templatePath(ns, file),
				this.destinationPath(fixTemplatePath(file)),
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
