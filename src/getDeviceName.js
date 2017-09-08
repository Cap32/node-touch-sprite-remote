
import request from 'request-promise-native';

export default async function getDeviceName(target) {
	return request(`${target}/devicename`);
}
