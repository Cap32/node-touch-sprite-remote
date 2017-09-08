
import { fetchAuth, getDeviceName, run, stop, status, upload } from '../src';
import createMockDevice from './fixtures/createMockDevice';
import { join, resolve } from 'path';
import { readJsonSync, pathExistsSync } from 'fs-extra';
import delay from 'delay';

const realDataPath = resolve('real-data.json');
const useReal = process.env.TSR_ENV === 'real' && pathExistsSync(realDataPath);
const realData = useReal ? readJsonSync(realDataPath) : {};

let auth = 'asdf';

describe('auth', () => {
	test('fetchAuth', async () => {
		jest.setTimeout(30000);
		const res = await fetchAuth({
			devices: [],
			key: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			valid: 3600,
			...realData,
		});

		if (useReal) { auth = res.auth; }
		expect(res.status).toBe(useReal ? 200 : 401);
	});
});

describe('devices', () => {
	let deviceA;
	let deviceB;

	beforeEach(async () => {
		const mockDevice = createMockDevice(auth, realData);
		deviceA = mockDevice(3001);
		deviceB = mockDevice(3002);
		await deviceA.start();
		await deviceB.start();
	});

	afterEach(async () => {
		await deviceA.stop();
		await deviceB.stop();
		await delay(1000);
	});

	test('getDeviceName', async () => {
		const res = await getDeviceName(deviceA.url);
		expect(res).toBe(realData.expectedDeviceName || 'hello');
	});

	test('status', async () => {
		const res1 = await status(deviceA.url, { auth });
		expect(res1.trim()).toBe('f00');

		await run(deviceA.url, { auth });
		await delay(100);
		const res2 = await status(deviceA.url, { auth });
		expect(res2.trim()).toBe(useReal ? 'f01' : 'f00');
	});

	test('stop', async () => {
		await run(deviceA.url, { auth });
		await delay(100);
		const res = await stop(deviceA.url, { auth });
		expect(res.trim()).toBe('ok');
	});

	test('run', async () => {
		const res = await run(deviceA.url, { auth });
		expect(res.trim()).toBe('ok');
	});

	test('upload', async () => {
		const res = await upload(deviceB.url, {
			file: join(__dirname, 'fixtures/res.jpg'),
			type: 'res',
			clientFile: '/fork.png',
			auth,
		});
		expect(res.trim()).toBe('ok');
	});

});
