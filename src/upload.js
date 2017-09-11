
import { lstat, createReadStream } from 'fs-extra';
import { parse, extname } from 'path';
import request from 'request';

export default async function upload(target, options = {}) {
	const { remoteFile, file, type, auth } = options;
	const root = (function () {
		if (type) { return type; }
		const luaExts = ['.lua', '.luac', '.txt'];
		const ext = extname(file);
		return luaExts.indexOf(ext) > -1 ? 'lua' : 'res';
	}());
	const remoteFilePath = remoteFile || `/${parse(file).base}`;
	const { dir, base } = parse(remoteFilePath);
	const stat = await lstat(file);
	const res = await new Promise((resolve, reject) => {
		createReadStream(file).pipe(
			request({
				url: `${target}/upload`,
				method: 'POST',
				headers: {
					auth,
					root,
					path: dir,
					filename: base,
					'Content-Type': 'touchsprite/uploadfile',
					'Content-Length': stat.size,
				}
			}, (err, res, body) => {
				if (err) { reject(err); }
				else if (res.statusCode !== 200) { reject(res.statusText); }
				else { resolve(body); }
			})
		);
	});
	return res.trim();
}
