
import { fetchAuth, getDeviceName, run } from '../src';

test('fetchAuth', async () => {
	jest.setTimeout(30000);
	const res = await fetchAuth({
		devices: [],
		key: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		valid: 3600,
	});
	expect(res.status).toBe(401);
});

test('getDeviceName', async () => {
	const res = await getDeviceName('http://192.168.199.126:50005');
	console.log('res', res);
	// expect(!!lib).toBe(true);
});

test('run', async () => {
	const res = await run('http://192.168.199.126:50005', {
		auth: 'asdf',
	});
	expect(res.trim()).toBe('ok');
});
