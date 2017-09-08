
import request from 'request-promise-native';

const AUTH_API = 'https://storeauth.touchsprite.com/api/openapi';

export async function fetchAuth(options = {}) {
	const { key, devices, valid } = options;
	return request({
		url: AUTH_API,
		method: 'POST',
		json: true,
		body: {
			action: 'getAuth',
			time: ~~(Date.now() / 1000),
			key,
			devices,
			valid,
		},
	});
};
