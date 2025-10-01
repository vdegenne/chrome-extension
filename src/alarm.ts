import {DEBUG, getDate} from './debug.js'

const alarmCallbacks: Record<string, () => Promise<void> | void> = {}

// Single listener for all alarms
chrome.alarms.onAlarm.addListener(async (alarm) => {
	console.log(
		`"onAlarm" event called (alarm name: ${alarm.name}) (${getDate()})`,
	)
	const cb = alarmCallbacks[alarm.name]
	if (cb) {
		try {
			if (DEBUG()) {
				console.log(`Alarm "${alarm.name}" called (${getDate()}).`)
			}
			await cb()
		} catch (err) {
			console.error(`Alarm "${alarm.name}" callback failed:`, err)
		}
	}
})

interface AlarmOptions {
	/** @default 10 */
	periodInMinutes: number
	/**
	 * Reset the timer if the alarm already exists.
	 *
	 * @default false
	 */
	resetAlarm: boolean
	/**
	 * If you create alarm that already exists, the callback will be replaced by default.
	 * This ensures the callback is always registered when the background worker wakes up again.
	 *
	 * @default true
	 */
	replaceCallback: boolean
}

/**
 * You need "alarms" permission to use this tool.
 *
 * Interesting fact about alarms,
 * When you reload your extension, alarms are not automatically destroyed,
 * trying to create an alarm with the same name in the background body will fail (pass "force" argument in that case).
 */
export async function createAlarm(
	name: string,
	callback: () => Promise<void> | void,
	options?: Partial<AlarmOptions>,
) {
	const _options: AlarmOptions = {
		resetAlarm: false,
		periodInMinutes: 10,
		replaceCallback: true,
		...options,
	}

	if ((await chrome.alarms.get(name)) !== undefined) {
		if (!_options.resetAlarm && DEBUG()) {
			console.warn(
				`Alarm "${name}" already exists. Set "reset" if you want to reset the timer. (${getDate()})`,
			)
		} else {
			chrome.alarms.create(name, {periodInMinutes: _options.periodInMinutes})
			console.log(`Alarm "${name}" reset (${getDate()})`)
		}
	} else {
		chrome.alarms.create(name, {periodInMinutes: _options.periodInMinutes})
		if (DEBUG()) {
			console.log(`Created alarm "${name}" successfully (${getDate()})`)
			console.log(await chrome.alarms.get(name))
		}
	}

	// Store the callback
	if (!alarmCallbacks[name] || _options.replaceCallback) {
		alarmCallbacks[name] = callback
	}
}
