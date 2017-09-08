
import request from 'request-promise-native';

export default async function stop(target, options = {}) {
	const { auth } = options;
	return request({
		url: `${target}/stopLua`,
		headers: { auth },
	});
}
