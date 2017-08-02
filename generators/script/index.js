const Yodot = require('../yodot');
const _ = require('lodash');

module.exports = class extends Yodot {
	async ask() {
		const modules = [ 'gd', ...this.getModules() ];

		const answers = await this.prompt([ {
			name: 'name',
			type: 'input',
			message: 'Script name?',
			default: 'main'
		}, {
			name: 'parent',
			type: 'input',
			message: 'Class to extend?',
			default: 'Node2D'
		}, {
			name: 'type',
			type: 'list',
			message: 'Type of script?',
			choices: modules,
			default: 'gd'
		} ]);
		_.assign(this.ctx, answers);
	}

	main() {
		let ns = this.ctx.type;
		if (ns === 'gd') ns = 'core';

		super.main({
			ns,
			mappings: {
				'scripts/script.gd': `scripts/${this.ctx.name}.gd`,
				'scripts/script.gdns': `scripts/${this.ctx.name}.gdns`,
				'src/script.nim': `src/${this.ctx.name}.nim`
			}
		});
	}
};
