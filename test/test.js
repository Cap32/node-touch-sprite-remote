
import TSRemote, {
	fetchAuth, wrapAuth,
	getDeviceName, run, stop, status, upload,
} from '../src';
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

	test('wrapAuth', async () => {
		jest.setTimeout(30000);
		let savedToken;
		const mockGetAuth = jest.fn(() => savedToken);
		const mockSetAuth = jest.fn((res) => {
			savedToken = res.auth || 'asdf';
		});
		const fetchOptions = {
			devices: [],
			key: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			valid: 3600,
			...realData,
		};

		const token1 = await wrapAuth(fetchOptions, mockGetAuth, mockSetAuth);
		useReal && expect(typeof token1).toBe('string');
		expect(mockGetAuth.mock.calls.length).toBe(1);
		expect(mockSetAuth.mock.calls.length).toBe(1);
		expect(typeof mockSetAuth.mock.calls[0][0].status).toBe('number');

		const token2 = await wrapAuth(fetchOptions, mockGetAuth, mockSetAuth);
		useReal && expect(typeof token2).toBe('string');
		expect(mockGetAuth.mock.calls.length).toBe(2);
		expect(mockSetAuth.mock.calls.length).toBe(1);
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
		jest.setTimeout(30000);
		const res1 = await status(deviceA.url, { auth });
		expect(res1).toBe('f00');

		await run(deviceA.url, { auth });
		await delay(100);
		const res2 = await status(deviceA.url, { auth });
		expect(res2).toBe(useReal ? 'f01' : 'f00');
		await stop(deviceA.url, { auth });
	});

	test('stop', async () => {
		await stop(deviceA.url, { auth });
		await run(deviceA.url, { auth });
		await delay(100);
		const res = await stop(deviceA.url, { auth });
		expect(res).toBe('ok');
	});

	test('run', async () => {
		await stop(deviceA.url, { auth });
		await delay(1000);
		const res = await run(deviceA.url, { auth });
		expect(res).toBe('ok');
	});

	test('upload', async () => {
		const res = await upload(deviceB.url, {
			file: join(__dirname, 'fixtures/res.jpg'),
			type: 'res',
			remoteFile: '/fork.png',
			auth,
		});
		expect(res).toBe('ok');
	});
});

describe('TSRemote', () => {
	let device;
	let token;
	let tsr;

	beforeEach(async () => {
		const mockDevice = createMockDevice(auth, realData);
		device = mockDevice(3001);
		await device.start();
	});

	afterEach(async () => {
		await device.stop();
		await delay(1000);
	});

	test('new TSRemote()', async () => {
		tsr = new TSRemote({
			devices: [],
			key: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			valid: 3600,
			getAuth: async () => token,
			setAuth: async (auth) => (token = useReal ? auth.auth : 'asdf'),
			...realData,
		});
	});

	test('tsr.stop()', async () => {
		const res = await tsr.stop(device.url);
		expect(res).toBe('ok');
	});

	test('tsr.status()', async () => {
		const res = await tsr.status(device.url);
		expect(res).toBe('f00');
	});

	test('tsr.run()', async () => {
		const res = await tsr.run(device.url);
		expect(res).toBe('ok');
	});

	test('tsr.upload()', async () => {
		const res = await tsr.upload(device.url, {
			file: join(__dirname, 'fixtures/res.jpg'),
			type: 'res',
			remoteFile: '/fork.png',
		});
		expect(res).toBe('ok');
	});

	test('tsr.refreshToken()', async () => {
		const getAuth = jest.fn(async () => token);
		tsr = new TSRemote({
			devices: [],
			key: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			valid: 3600,
			getAuth,
			setAuth: async (auth) => (token = useReal ? auth.auth : 'asdf'),
			...realData,
		});
		await tsr.status(device.url);
		expect(getAuth.mock.calls.length).toBe(0);
		await tsr.status(device.url);
		expect(getAuth.mock.calls.length).toBe(1);
		tsr.refreshToken();
		await tsr.status(device.url);
		expect(getAuth.mock.calls.length).toBe(1);
	});

	test('tsr.addDevices()', async () => {
		if (useReal) { return; }
		const getAuth = jest.fn(async () => token);
		tsr = new TSRemote({
			devices: [],
			key: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			valid: 3600,
			getAuth,
			setAuth: async (auth) => (token = useReal ? auth.auth : 'asdf'),
			...realData,
		});
		await tsr.status(device.url);
		expect(getAuth.mock.calls.length).toBe(0);
		await tsr.status(device.url);
		expect(getAuth.mock.calls.length).toBe(1);
		tsr.addDevices('asdf');
		await tsr.status(device.url);
		expect(getAuth.mock.calls.length).toBe(1);
		expect(tsr._fetchOptions.devices).toEqual(['asdf']);
	});

	test('tsr.removeDevices()', async () => {
		if (useReal) { return; }
		const getAuth = jest.fn(async () => token);
		tsr = new TSRemote({
			devices: ['foo', 'bar'],
			key: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			valid: 3600,
			getAuth,
			setAuth: async (auth) => (token = useReal ? auth.auth : 'asdf'),
			...realData,
		});
		await tsr.status(device.url);
		expect(getAuth.mock.calls.length).toBe(0);
		await tsr.status(device.url);
		expect(getAuth.mock.calls.length).toBe(1);
		tsr.removeDevices('bar');
		await tsr.status(device.url);
		expect(getAuth.mock.calls.length).toBe(1);
		expect(tsr._fetchOptions.devices).toEqual(['foo']);
	});

});
