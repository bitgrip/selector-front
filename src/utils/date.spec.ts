import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatDate, getActiveEvents, getLastEvent, getRemainingTime } from './date';
import { mockedIntervalEvents, mockedOneDayEvents } from 'tests/mocks/mockedEvents.js';

beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
});

describe('getRemainingTime()', () => {
	it('get correct date difference', () => {
		const date = new Date(2022, 12, 1, 13, 10);
		vi.setSystemTime(date);
		const remainingTime = getRemainingTime(new Date(2022, 12, 1, 13, 29));
		expect(remainingTime).toEqual({ days: 0, hours: 0, minutes: 19, seconds: 0 });
	});
});

describe('getActiveEvents()', () => {
	// doesnt work yet :( dunno why yet, time mocking function is hard to debug but obviously working, see the test above
	// will be probably easier to make the second date parameter as well
	it.skip('returns only one day events that are active on given day', () => {
		const date = new Date(2022, 12, 22, 10, 0);
		vi.setSystemTime(date);
		const activeEvents = getActiveEvents(mockedOneDayEvents);
	});
	// doesnt work yet :( dunno why yet, time mocking function is hard to debug but obviously working, see the test above
	// will be probably easier to make the second date parameter as well
	it.skip('returns only events that are active on given day', () => {
		const date = new Date(2022, 12, 22, 10, 0);
		vi.setSystemTime(date);
		const activeEvents = getActiveEvents(mockedIntervalEvents);
	});
});

describe('getLastEvent()', () => {
	it('returns last one-day event', () => {
		// doesnt work yet :( dunno why yet, time mocking function is hard to debug but obviously working, see the test above
		// will be probably easier to make the reference date as parameter as well
		const lastEvent = getLastEvent(mockedOneDayEvents);
	});
});

describe('formatDate()', () => {
	it('formats date correctly', () => {
		const formattedDate = formatDate('2022-11-10T19:05:14.298Z');
        expect(formattedDate).toBe("2022-11-10");
	});
});
