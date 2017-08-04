const { stripIndent } = require('common-tags');

module.exports = (ctx) => {
	const body = stripIndent`
		[gd_scene format=2]

		[node name="${ctx.nodeName}" type="${ctx.nodeType}"]
	` + '\n';

	return {
		body
	};
};

