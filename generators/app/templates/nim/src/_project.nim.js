const _ = require('lodash');
const { stripIndent } = require('common-tags');

module.exports = (ctx) => {
	const body = stripIndent`
    when not defined(release):
      import segfaults # converts segfaults into NilAccessError
	` + '\n\n';

	return {
		name: _.kebabCase(ctx.name),
		body
	};
};
