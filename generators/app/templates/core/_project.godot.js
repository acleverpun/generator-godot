module.exports = (ctx) => {
	const body = {
		config_version: 3,
		application: {
			'config/name': `"${ctx.name}"`,
			'config/icon': '"res://icon.png"'
		},
		rendering: {
			'environment/default_environment': '"res://default_env.tres"'
		},
		node: {
			name_num_separator: 3,
			name_casing: 1
		}
	};

	return {
		type: 'ini',
		body
	};
};
