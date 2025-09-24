import {DEBUG} from './debug.js'

const alarmCallbacks: Record<string, () => Promise<void> | void> = {}

// Single listener for all alarms
chrome.alarms.onAlarm.addListener(async (alarm) => {
	const cb = alarmCallbacks[alarm.name]
	if (cb) {
		try {
			if (DEBUG()) {
				console.log(`Alarm "${alarm.name}" called.`)
			}
			await cb()
		} catch (err) {
			console.error(`Alarm "${alarm.name}" callback failed:`, err)
		}
	}
})

/**
 * You need "alarms" permission to use this tool.
 *
 * Interesting fact about alarms,
 * When you reload your extension, alarms are not automatically destroyed,
 * trying to create an alarm with the same name in the background body will fail (pass "force" argument in that case).
 */
export async function createAlarm(
	name: string,
	periodInMinutes: number,
	callback: () => Promise<void> | void,
	force = false,
) {
	if ((await chrome.alarms.get(name)) !== undefined) {
		if (!force) {
			if (DEBUG()) {
				console.error(
					`Trying to create alarm "${name}" again failed. Set "force" to true to create it again.`,
				)
				return
			}
		} else {
			await chrome.alarms.clear(name)
		}
	}

	// Store the callback
	alarmCallbacks[name] = callback

	chrome.alarms.create(name, {periodInMinutes})

	if (DEBUG()) {
		console.log(`Created alarm "${name}" successfully`)
		console.log(await chrome.alarms.get(name))
	}
}
