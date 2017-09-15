
import request from 'request-promise-native';
import { ensureTarget } from './utils';

export default async function status(target, options = {}) {
	const { auth } = options;
	const res = await request({
		url: `${ensureTarget(target)}/status`,
		headers: { auth },
	});
	return res.trim();
}
