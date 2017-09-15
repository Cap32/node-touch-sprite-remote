
import request from 'request-promise-native';
import { ensureTarget } from './utils';

export default async function run(target, options = {}) {
	const { auth } = options;
	const res = await request({
		url: `${ensureTarget(target)}/runLua`,
		headers: { auth },
	});
	return res.trim();
}
