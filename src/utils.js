
import getMyIp from 'get-my-ip';

export function ensureTarget(target) {
	if (!target) { throw new Error('Missing target'); }

	if (/^\d*$/.test(target)) {
		const myIp = getMyIp();
		if (!myIp) {
			throw new Error(
				'IP address not found. Please make sure network is available',
			);
		}

		const parts = myIp.split('.');
		parts[3] = target;
		target = parts.join('.');
	}

	if (!/^http/i.test(target)) {
		target = 'http://' + target;
	}

	if (!/:\d/.test(target)) {
		target += ':50005';
	}

	return target;
}
