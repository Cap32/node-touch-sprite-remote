
import { getDeviceName } from '../src';

test('getDeviceName', async () => {
	const res = await getDeviceName({ target: 'http://192.168.199.126:50005' });
	console.log('res', res);
	// expect(!!lib).toBe(true);
});
