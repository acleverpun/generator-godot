const Generator = require('yeoman-generator');
const _ = require('lodash');
const chalk = require('chalk');
const glob = require('glob');
const path = require('path');
const yosay = require('yosay');

module.exports = class extends Generator {
	init() {
		this.ctx = {};
	}

	greet() {
		this.log(yosay(`Welcome to the wonderful ${chalk.red('generator-godot')} generator!`));
	}

	paths() {
		const templatePath = this.templatePath();

		this.templateFiles = [
			'project.godot'
		].map((file) => makeRelative(file, templatePath));

		this.allFiles = glob.sync(this.templatePath('**'), { dot: true })
			.slice(1)
			.map((file) => makeRelative(file, templatePath));
		this.staticFiles = _.difference(this.allFiles, this.templateFiles);
	}

	async ask() {
		const answers = await this.prompt({
			name: 'name',
			type: 'input',
			message: 'Project name?',
			default: path.basename(process.cwd())
		});

		_.assign(this.ctx, answers);
	}

	write() {
		for (const file of this.staticFiles) {
			this.fs.copy(
				this.templatePath(file),
				this.destinationPath(file)
			);
		}

		for (const file of this.templateFiles) {
			this.fs.copyTpl(
				this.templatePath(file),
				this.destinationPath(file),
				this.ctx
			);
		}
	}
};

function makeRelative(filePath, templatePath) {
	return filePath.replace(`${templatePath}/`, '');
}
