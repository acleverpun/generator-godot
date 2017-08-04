const Yodot = require('../../lib/yodot');
const _ = require('lodash');

module.exports = class extends Yodot {
	async ask() {
		let answers = await this.prompt([ {
			name: 'name',
			type: 'input',
			message: 'Scene name?',
			default: 'main'
		} ]);
		_.assign(this.ctx, answers);

		answers = await this.prompt([ {
			name: 'nodeName',
			type: 'input',
			message: 'Root node name?',
			default: answers.name
		}, {
			name: 'nodeType',
			type: 'input',
			message: 'Root node type?',
			default: 'Node2D'
		}, {
			name: 'main',
			type: 'confirm',
			message: 'Make main scene?',
			default: false
		} ]);
		_.assign(this.ctx, answers);
	}

	main() {
		super.main();
	}
};

