const Yodot = require('../yodot');
const _ = require('lodash');

module.exports = class extends Yodot {
	async ask() {
		const answers = await this.prompt([ {
			name: 'name',
			type: 'input',
			message: 'Script name?',
			default: 'main'
		}, {
			name: 'type',
			type: 'input',
			message: 'Class to extend?',
			default: 'Node2D'
		} ]);
		_.assign(this.ctx, answers);
	}

	main() {
		const file = `scripts/${this.ctx.name}.gd`;

		super.main({
			mappings: { 'scripts/script.gd': file }
		});
	}
};
