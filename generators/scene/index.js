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
		const file = `scenes/${this.ctx.name}.tscn`;

		super.main({
			mappings: { 'scenes/scene.tscn': file }
		});

		// Register as main scene
		if (this.ctx.main) {
			const projectFile = this.destinationPath('project.godot');
			const setting = `run/main_scene="res://${file}"`;

			let lines = this.fs.read(projectFile).split('\n');
			for (let l = 0; l <= lines.length; l++) {
				let line = lines[l];
				// Update setting if already present
				if (/^run\/main_scene=/.test(line)) {
					lines[l] = setting;
					break;
				}
				// Add setting if not already present
				if (/^config\/icon=/.test(line)) {
					lines.splice(l, 0, setting);
					break;
				}
			}
			lines.push('');

			this.fs.write(projectFile, lines.join('\n'));
		}
	}
};
