const _ = require('lodash');
const { stripIndent } = require('common-tags');

const body = stripIndent`
  import godot
  import node

  gdobj <%= name %> of <%= parent %>:
    method ready*() =
      print("<%= name %>")
`;

module.exports = (ctx) => {
	return {
		name: _.kebabCase(ctx.name),
		body
	};
};
