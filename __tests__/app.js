const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const path = require('path');

describe('generator-godot:app', () => {
	beforeAll(() => {
		return helpers.run(path.join(__dirname, '../generators/app'))
			.withPrompts({ someAnswer: true });
	});

	it('creates files', () => {
		assert.file([ 'dummyfile.txt' ]);
	});
});
