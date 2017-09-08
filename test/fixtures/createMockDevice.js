
import http from 'http';
import pify from 'pify';
import url from 'url';

export default function createMockDevice(auth, deviceData) {
	return function mockDevice(port = 3001) {
		const noop = () => {};
		const { target } = deviceData;
		const server = http.createServer((req, res) => {
			const { method, headers, url: reqURL } = req;
			const { pathname } = url.parse(reqURL);

			const end = (data, statusCode = 200) => {
				res.writeHead(statusCode);
				res.end(data);
			};

			const routes = {
				'GET /runLua': () => {
					if (headers.auth === auth) {
						end('ok');
					}
					else {
						end('fail', 401);
					}
				},
				'GET /devicename': () => end('hello'),
				'POST /upload': () => end('ok'),
			};

			const route = `${method} ${pathname}`;

			if (typeof routes[route] === 'function') {
				routes[route]();
			}
			else if (route.startsWith('OPTIONS')) {
				end(null, 204);
			}
			else {
				end(null, 404);
			}
		});

		return {
			start: target ? noop : () => pify(::server.listen)(port, 'localhost'),
			stop: target ? noop : pify(::server.close),
			url: target || `http://localhost:${port}`,
		};
	};

}
