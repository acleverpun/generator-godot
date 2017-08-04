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
