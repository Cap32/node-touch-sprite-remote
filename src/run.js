
import request from 'request-promise-native';

export default async function run(target, options = {}) {
	const { auth } = options;
	return request({
		url: `${target}/runLua`,
		headers: { auth },
	});
}
