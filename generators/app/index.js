const Yodot = require('../../lib/yodot');
const _ = require('lodash');
const chalk = require('chalk');
const Git = require('simple-git/promise');
const path = require('path');
const pkg = require('../../package.json');
const yosay = require('yosay');

const git = new Git();

module.exports = class extends Yodot {
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
			name: 'author',
			type: 'input',
			message: 'Author?',
			default: await getGitUser(),
			store: true
		}, {
			name: 'modules',
			type: 'checkbox',
			message: 'Modules?',
			choices: this.getModules(),
			store: true
		} ]);
		_.assign(this.ctx, answers);

		this.config.set('name', answers.name);
	}

	main() {
		super.main();
		for (const module of this.ctx.modules) super.main({ ns: module });
	}
};

function getGitUser() {
	return git.raw('config --get user.name'.split(' '))
		.then((result) => result.trim());
}
