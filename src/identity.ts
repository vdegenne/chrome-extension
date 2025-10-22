/**
 * Generates a redirect url to be used in `launchWebAuthFlow`.
 */
function getRedirectURL(path?: string) {
	return chrome.identity.getRedirectURL(path)
}

interface GetGoogleOAuthURLOptions {
	/**
	 * @default undefined
	 */
	redirectPath: string | undefined

	/**
	 * @default 'id_token'
	 */
	responseType: 'id_token' | 'access_token'

	/**
	 * @default ['profile', 'email']
	 */
	scopes: string[]
}

/**
 * Generates a google oauth url to be used in `launchWebAuthFlow`.
 */
export function getGoogleOauthURL(
	googleClientId: string,
	options?: Partial<GetGoogleOAuthURLOptions>,
) {
	const _options: GetGoogleOAuthURLOptions = {
		redirectPath: undefined,
		responseType: 'id_token',
		scopes: ['profile', 'email'],
		...options,
	}
	const redirectURL = getRedirectURL(_options.redirectPath)
	const responseTypeParam =
		_options.responseType === 'access_token' ? 'token' : 'id_token'

	return (
		`https://accounts.google.com/o/oauth2/v2/auth` +
		`?client_id=${encodeURIComponent(googleClientId)}` +
		`&response_type=${responseTypeParam}` +
		`&redirect_uri=${encodeURIComponent(redirectURL)}` +
		`&scope=${encodeURIComponent(_options.scopes.join(' '))}` +
		(_options.responseType === 'id_token'
			? `&nonce=${Math.random().toString(36).substring(2)}`
			: '')
	)
	// TODO: You MUST store this `nonce` somewhere to verify it later!
	// For a Chrome extension, you might store it in chrome.storage.local or memory
	// until the redirect comes back.
}

/**
 * You will need "identity" and "identity.email" as permissions for this.
 */
export function launchWebAuthFlow(url: string) {
	return chrome.identity.launchWebAuthFlow({
		url,
		interactive: true,
	})
}

/**
 * Using WebAuthFlow in the background
 */
export async function getGoogleIdToken(
	googleClientId: string,
	options?: Partial<Omit<GetGoogleOAuthURLOptions, 'responseType'>>,
) {
	const url = getGoogleOauthURL(googleClientId, {
		...options,
		responseType: 'id_token',
	})
	let result: string | undefined

	try {
		result = await launchWebAuthFlow(url)
	} catch {
		return
	}
	return result ? extractIdToken(result) : undefined
}

/**
 * Extracts the ID token from a redirected URL fragment.
 */
export function extractIdToken(redirectedUrl: string): string | undefined {
	const match = redirectedUrl.match(/[#&]id_token=([^&]+)/)
	return match ? decodeURIComponent(match[1]) : undefined
}

/**
 * Extracts the access token from a redirected URL fragment.
 */
export function extractAccessToken(redirectedUrl: string): string | undefined {
	const match = redirectedUrl.match(/[#&]access_token=([^&]+)/)
	return match ? decodeURIComponent(match[1]) : undefined
}
