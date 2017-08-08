module.exports = (ctx) => {
	if (!ctx.main) return;

	const body = {
		application: {
			'run/main_scene': `"res://scenes/${ctx.name}.tscn"`
		}
	};

	return {
		type: 'ini',
		body
	};
};

