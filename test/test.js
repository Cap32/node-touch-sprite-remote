
import { fetchAuth, getDeviceName, run, upload } from '../src';
import mockDevice from './fixtures/mockDevice';
import { join } from 'path';

describe('auth', () => {
	test('fetchAuth', async () => {
		jest.setTimeout(30000);
		const res = await fetchAuth({
			devices: [],
			key: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			valid: 3600,
		});
		expect(res.status).toBe(401);
	});
});

describe('devices', () => {
	let deviceA;
	let deviceB;

	beforeEach(async () => {
		deviceA = mockDevice(3001);
		deviceB = mockDevice(3002);
		await deviceA.start();
		await deviceB.start();
	});

	afterEach(async () => {
		await deviceA.stop();
		await deviceB.stop();
	});

	test('getDeviceName', async () => {
		const res = await getDeviceName(deviceA.url);
		expect(res).toBe('hello');
	});

	test('run', async () => {
		const res = await run(deviceA.url, {
			auth: 'asdf',
		});
		expect(res.trim()).toBe('ok');
	});

	test('upload', async () => {
		const res = await upload(deviceB.url, {
			file: join(__dirname, 'fixtures/res.jpg'),
			type: 'res',
			clientFile: '/fork.png',
			auth: 'asdf',
		});
		expect(res.trim()).toBe('ok');
	});

});
