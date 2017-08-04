const Yodot = require('../yodot');
const _ = require('lodash');
const ini = require('ezini');
const utils = require('../../utils');

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
		const file = `scenes/${this.ctx.name}.tscn`;

		super.main({
			mappings: { 'scenes/scene.tscn': file }
		});

		// Register as main scene
		if (this.ctx.main) {
			const projectFile = this.destinationPath('project.godot');
			const key = 'run/main_scene';
			const value = `res://${file}`;

			// Add or overwrite setting
			const body = ini.parseSync(this.fs.read(projectFile));
			body.application[key] = value;
			this.fs.write(projectFile, ini.stringifySync(utils.fixIni(body)));
		}
	}
};

