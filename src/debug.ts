let _DEBUG = false

export function DEBUG(debug?: boolean) {
	if (debug !== undefined) {
		_DEBUG = debug
	}
	return _DEBUG
}

export function getDate() {
	return new Date().toLocaleString()
}
