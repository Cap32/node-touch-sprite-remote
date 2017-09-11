
import request from 'request-promise-native';

export default async function stop(target, options = {}) {
	const { auth } = options;
	const res = await request({
		url: `${target}/stopLua`,
		headers: { auth },
	});
	return res.trim();
}
