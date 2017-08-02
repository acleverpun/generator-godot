const Yodot = require('../yodot');
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
		const sceneName = `scenes/${this.ctx.name}.tscn`;

		super.main({
			mappings: { 'scenes/scene.tscn': sceneName }
		});

		// Register as main scene
		if (this.ctx.main) {
			const file = this.destinationPath('project.godot');
			const setting = `run/main_scene="res://${sceneName}"`;

			let lines = this.fs.read(file).split('\n');
			lines = lines.map((line, l) => {
				if (/^config\/name=/.test(line)) lines.splice(l + 1, 0, setting);
				return line;
			});
			lines.push('');

			this.fs.write(file, lines.join('\n'));
		}
	}
};
