
import { wrapAuth } from './Auth';
import run from './run';
import stop from './stop';
import status from './status';
import upload from './upload';

export default class TSRemote {
	constructor(options = {}) {
		const { getAuth, setAuth, ...fetchOptions } = options;
		this._fetchOptions = fetchOptions;
		this._getAuth = getAuth;
		this._setAuth = setAuth;
	}

	async _ensureAuth(options = {}) {
		if (options.auth) { return options.auth; }
		options.auth = await wrapAuth(
			this._fetchOptions,
			this._getAuth,
			this._setAuth,
		);
		return options;
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
