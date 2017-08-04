const { stripIndent } = require('common-tags');

module.exports = (ctx) => {
	const body = stripIndent`
		extends ${ctx.parent}

		func _ready():
			pass
	` + '\n';

	return {
		name: ctx.name,
		body
	};
};

