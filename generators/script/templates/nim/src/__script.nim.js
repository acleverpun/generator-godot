const _ = require('lodash');
const { stripIndent } = require('common-tags');

module.exports = (ctx) => {
	const body = stripIndent`
    import godot
    import node

    gdobj ${ctx.name} of ${ctx.parent}:
      method ready*() =
        print("${ctx.name}")
	`;

	return {
		name: _.kebabCase(ctx.name),
		body
	};
};