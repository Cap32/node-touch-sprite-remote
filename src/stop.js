
import request from 'request-promise-native';
import { ensureTarget } from './utils';

export default async function stop(target, options = {}) {
	const { auth } = options;
	const res = await request({
		url: `${ensureTarget(target)}/stopLua`,
		headers: { auth },
	});
	return res.trim();
}
