const _ = require('lodash');

module.exports = (ctx) => {
	const body = {
		'gd_resource type="NativeScript" load_steps=2 format=2': {},
		'ext_resource path="res://nimlib.tres" type="GDNativeLibrary" id=1': {},
		resource: {
			resource_name: ctx.name,
			class_name: ctx.name
		}
	};

	return {
		name: _.kebabCase(ctx.name),
		type: 'ini',
		body
	};
};
