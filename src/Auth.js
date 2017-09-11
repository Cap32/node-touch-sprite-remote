
import request from 'request-promise-native';
import noop from 'empty-functions/noop';

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

export async function wrapAuth(fetchOptions, getAuth = noop, setAuth = noop) {
	let auth = await getAuth();
	if (auth) { return auth; }
	auth = await fetchAuth(fetchOptions);
	await setAuth(auth);
	return auth.auth;
};
