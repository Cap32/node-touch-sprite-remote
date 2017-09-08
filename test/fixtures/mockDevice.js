
import http from 'http';
import pify from 'pify';
import url from 'url';

const create = () => http.createServer((req, res) => {
	const { method, headers, url: reqURL } = req;
	const { pathname } = url.parse(reqURL);

	const end = (data, statusCode = 200) => {
		res.writeHead(statusCode);
		res.end(data);
	};

	const routes = {
		'GET /runLua': () => {
			if (typeof headers.auth === 'string') {
				end('ok');
			}
			else {
				end('fail', 401);
			}
		},
		'GET /devicename': () => end('hello'),
		'POST /upload': () => end('ok'),
		// 'GET /ok': () => end({ method }),
		// 'POST /ok': () => end({ method }),
		// 'PUT /ok': () => end({ method }),
		// 'PATCH /ok': () => end({ method }),
		// 'DELETE /ok': () => end({ method }),
		// 'GET /headers': () => end(headers),
		// 'GET /bad': () => end({ message: 'you bad' }, 400),
		// 'GET /bad/bad': () => end({ message: 'you bad bad' }, 500),
		// 'GET /bad/bad/bad': () => { throw new Error('oh shit'); },
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

export default function mockDevice(port = 3001) {
	const server = create();
	return {
		start: () => pify(::server.listen)(port, 'localhost'),
		stop: pify(::server.close),
		url: `http://localhost:${port}`,
	};
}
