
import request from 'request-promise-native';
import { ensureTarget } from './utils';

export default async function getDeviceName(target) {
	const res = await request(`${ensureTarget(target)}/devicename`);
	return res.trim();
}
