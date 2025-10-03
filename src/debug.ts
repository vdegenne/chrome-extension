let _DEBUG = false

export function DEBUG(debug?: boolean | string) {
	if (debug === undefined) {
		return _DEBUG
	}
	if (typeof debug === 'boolean') {
		_DEBUG = debug
	} else if (typeof debug === 'string') {
		if (_DEBUG) {
			console.log(debug)
		}
	}
}

export function getDate() {
	return new Date().toLocaleString()
}
