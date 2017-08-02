const Yodot = require('../yodot');
const _ = require('lodash');
const chalk = require('chalk');
const glob = require('glob');
const path = require('path');
const pkg = require('../../package.json');
const yosay = require('yosay');

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
			name: 'modules',
			type: 'checkbox',
			message: 'Modules?',
			choices: [ 'nim' ],
			store: true
		} ]);
		_.assign(this.ctx, answers);
	}

	main() {
		super.main();
		for (const module of this.ctx.modules) super.main({ ns: module });
	}
};
