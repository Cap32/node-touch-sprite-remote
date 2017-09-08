
import request from 'request-promise-native';

export default async function status(target, options = {}) {
	const { auth } = options;
	return request({
		url: `${target}/status`,
		headers: { auth },
	});
}
