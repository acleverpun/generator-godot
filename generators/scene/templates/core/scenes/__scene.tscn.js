module.exports = (ctx) => {
	const body = {
		'gd_scene format=2': {},
		[`node name="${ctx.nodeName}" type="${ctx.nodeType}"`]: {}
	};

	return {
		name: ctx.name,
		type: 'ini',
		body
	};
};

