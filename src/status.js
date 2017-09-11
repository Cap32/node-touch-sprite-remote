
import request from 'request-promise-native';

export default async function status(target, options = {}) {
	const { auth } = options;
	const res = await request({
		url: `${target}/status`,
		headers: { auth },
	});
	return res.trim();
}
