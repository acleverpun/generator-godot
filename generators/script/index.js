const Yodot = require('../../lib/yodot');
const _ = require('lodash');

module.exports = class extends Yodot {
	async ask() {
		const answers = await this.prompt([ {
			name: 'name',
			type: 'input',
			message: 'Class name?',
			default: 'Main'
		}, {
			name: 'parent',
			type: 'input',
			message: 'Class to extend?',
			default: 'Node2D'
		}, {
			name: 'type',
			type: 'list',
			message: 'Type of script?',
			choices: this.getModules(),
			default: 'gd'
		} ]);
		_.assign(this.ctx, answers);
	}

	main() {
		let ns = this.ctx.type;

		super.main({ ns });
	}
};
