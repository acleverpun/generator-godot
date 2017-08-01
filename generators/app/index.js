const Generator = require('yeoman-generator');
const _ = require('lodash');
const chalk = require('chalk');
const glob = require('glob');
const yosay = require('yosay');

module.exports = class extends Generator {
	greet() {
		this.log(yosay(`Welcome to the wonderful ${chalk.red('generator-godot')} generator!`));
	}

	setup() {
		const templatePath = this.templatePath();

		this.templateFiles = [
			'project/project.godot'
		].map((file) => makeRelative(file, templatePath));

		this.allFiles = glob.sync(this.templatePath('**'), { dot: true })
			.slice(1)
			.map((file) => makeRelative(file, templatePath));
		this.staticFiles = _.difference(this.allFiles, this.templateFiles);
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
				{ title: 'foo' }
			);
		}
	}
};

function makeRelative(path, templatePath) {
	return path.replace(`${templatePath}/`, '');
}
