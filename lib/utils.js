const _ = require('lodash');

function deepMap(obj, iterator, context) {
	return _.transform(obj, function(result, val, key) {
		result[key] = (_.isObject(val)) ?
			deepMap(val, iterator, context) :
			iterator.call(context, val, key, obj);
	});
}
module.exports.deepMap = deepMap;

function fixIni(obj) {
	return deepMap(obj, (value, key) => {
		if (typeof value === 'string') return `"${value}"`;
		return value;
	});
}
module.exports.fixIni = fixIni;

function fixTemplatePath(filePath) {
	const parts = filePath.split('/');
	let file = _.last(parts);
	if (/^_/.test(file) && /\.js(on)?$/.test(file)) {
		parts[parts.length - 1] = file.replace(/^_/, '').replace(/\.js(on)?$/, '');
	}
	return parts.join('/');
}
module.exports.fixTemplatePath = fixTemplatePath;

function makeRelative(filePath, templatePath) {
	return filePath.replace(`${templatePath}/`, '');
}
module.exports.makeRelative = makeRelative;
