
import request from 'request-promise-native';

export default async function run(target, options = {}) {
	const { auth } = options;
	const res = await request({
		url: `${target}/runLua`,
		headers: { auth },
	});
	return res.trim();
}
