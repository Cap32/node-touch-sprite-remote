
import request from 'request-promise-native';

export default async function getDeviceName(target) {
	const res = await request(`${target}/devicename`);
	return res.trim();
}
