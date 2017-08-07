const _ = require('lodash');
const { stripIndent } = require('common-tags');

module.exports = (ctx, generator) => {
	const body = stripIndent`
    import godot
    import node

    gdobj ${ctx.name} of ${ctx.parent}:
      method ready*() =
        print("${ctx.name}")
	`;

	const importBody = `\nimport ${ctx.name}`;

	const runtimeFile = `src/${generator.config.get('name')}.nim`;
	generator.fs.append(generator.destinationPath(runtimeFile), importBody);

	return {
		name: _.kebabCase(ctx.name),
		body
	};
};
