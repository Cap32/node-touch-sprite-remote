
import { wrapAuth } from './Auth';
import run from './run';
import stop from './stop';
import status from './status';
import upload from './upload';

export default class TSRemote {
	constructor(options = {}) {
		const { getAuth, setAuth, ...fetchOptions } = options;
		if (!fetchOptions.devices) { fetchOptions.devices = []; }
		this._fetchOptions = fetchOptions;
		this._shouldRefreshToken = true;
		this._originalGetAuth = getAuth;
		this._setAuth = setAuth;
	}

	async _getAuth() {
		if (this._shouldRefreshToken) {
			this._shouldRefreshToken = false;
		}
		else {
			return this._originalGetAuth();
		}
	}

	async _ensureAuth(options = {}) {
		if (options.auth) { return options.auth; }
		options.auth = await wrapAuth(
			this._fetchOptions,
			::this._getAuth,
			::this._setAuth,
		);
		return options;
	}

	addDevices(...devices) {
		this._fetchOptions.devices.push(...devices);
		this._shouldRefreshToken = true;
		return this;
	}

	removeDevices(...devices) {
		devices.forEach((device) => {
			const index = this._fetchOptions.devices.indexOf(device);
			if (index > -1) {
				this._fetchOptions.devices.splice(index, 1);
			}
		});
		this._shouldRefreshToken = true;
		return this;
	}

	refreshToken() {
		this._shouldRefreshToken = true;
		return this;
	}

	async run(target, options) {
		options = await this._ensureAuth(options);
		return run(target, options);
	}

	async stop(target, options) {
		options = await this._ensureAuth(options);
		return stop(target, options);
	}

	async status(target, options) {
		options = await this._ensureAuth(options);
		return status(target, options);
	}

	async upload(target, options) {
		options = await this._ensureAuth(options);
		return upload(target, options);
	}
}
