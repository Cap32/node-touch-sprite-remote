# touch-sprite-remote

Touch script remote API for Node.js


## Table of Contents

<!-- MarkdownTOC autolink="true" bracket="round" -->

- [Installation](#installation)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
  - [fetchAuth\(options\)](#fetchauthoptions)
  - [getDeviceName\(target\)](#getdevicenametarget)
  - [status\(target\[, options\]\)](#statustarget-options)
  - [run\(target\[, options\]\)](#runtarget-options)
  - [stop\(target\[, options\]\)](#stoptarget-options)
  - [upload\(target\[, options\]\)](#uploadtarget-options)
  - [TSRemote](#tsremote)
- [License](#license)

<!-- /MarkdownTOC -->


<a name="installation"></a>
## Installation

```bash
npm install touch-sprite-remote
```


<a name="getting-started"></a>
## Getting Started

```js
import { fetchAuth, run, status } from 'touch-sprite-remote';

(async function () {
  const { auth } = await fetchAuth({
    key: '<my_key>',
    devices: ['<my_device_id>'],
  });
  const runResult = await run('http://192.168.1.23:50005', { auth });
  console.log('run:', runResult); /* "ok" or "fail" */

  const statusResult = await status('http://192.168.1.23:50005', { auth });
  console.log('status:', statusResult); /* "ok" or "fail" */
}());
```


<a name="api-reference"></a>
## API Reference

<a name="fetchauthoptions"></a>
### fetchAuth(options)

Fetch auth / access token.

###### Options

- `key` (String): Developer access key
- `devices`: ([String]): Devices IDs
- `expiresIn` (Number): Expires in seconds. Defaults to 3600

###### Returns

```js
{
  status: 200,
  message: 'error message if status is not 200',
  time: 1422930265, // current unix timestamp
  auth: 'auth / access token',
  valid: 3600000, // valid time
  remainderToken: 4, // remainder token
}
```

---


<a name="getdevicenametarget"></a>
### getDeviceName(target)

Get device name.

###### Arguments

- `target` (String): Device host target. eg: 'http://192.168.1.23:50005'

###### Returns

(String): Device name.

---


<a name="statustarget-options"></a>
### status(target[, options])

Get status.

###### Arguments

- `target` (String): Device host target. eg: 'http://192.168.1.23:50005'
- `options` (Object): Defines `options.auth` for access token (required)

###### Returns

(String): Returns one of these string:

- `f00`: Free
- `f01`: In running scripts
- `f02`: In recording screen

---


<a name="runtarget-options"></a>
### run(target[, options])

Run script.

###### Arguments

- `target` (String): Device host target. eg: 'http://192.168.1.23:50005'
- `options` (Object): Defines `options.auth` for access token (required)

###### Returns

(String): `ok` or `fail`

---


<a name="stoptarget-options"></a>
### stop(target[, options])

Stop script.

###### Arguments

- `target` (String): Device host target. eg: 'http://192.168.1.23:50005'
- `options` (Object): Defines `options.auth` for access token (required)

###### Returns

(String): `ok` or `fail`

---


<a name="uploadtarget-options"></a>
### upload(target[, options])

Upload file.

###### Arguments

- `target` (String): Device host target. eg: 'http://192.168.1.23:50005'
- `options` (Object):
  + `auth` (String): Access token (required)
  + `file` (String): Local file path
  + `remoteFile` (String): Remote file path
  + `type` (String): Defining root type. One of `lua`, `res`, `log` or `plugin` is supported. By default, if `file` ext is `.lua`, `.luac` or `.txt`, it would be `lua`, otherwise, it would be `res`

###### Returns

(String): `ok` or `fail`

---


<a name="tsremote"></a>
### TSRemote

TSRemote class. A TSRemote instance by calling `new TSRemote(options)` provides all methods above, but could only get and set auth once.

The `options` is almost the same with `fetchAuth(options)`, but also provides these two auth cache getter and setter functions:

- `async getAuth()`: Will call when calling any api needs `auth`. It's useful to get `auth` from your cache system
- `async setAuth(authObject)`: Will call when `getAuth()` doesn't return `auth`. The `authObject` is the same with the result of `fetchAuth()`. It's useful to save the `auth` to your cache system

###### Example

```js
import TSRemote from 'touch-sprite-remote';

let cache;

(async function () {
  const tsr = new TSRemote({
    key: '<my_key>',
    devices: ['<my_device_id>'],

    /* add `getAuth()` and `setAuth()` functions */
    getAuth: async () => cache,
    setAuth: async ({ auth, expiresIn }) => (cache = auth),
  });

  /* no need `auth` option */
  const runResult = await tsr.run('http://192.168.1.23:50005');
  const statusResult = await tsr.status('http://192.168.1.23:50005');
}());
```



<a name="license"></a>
## License

MIT
