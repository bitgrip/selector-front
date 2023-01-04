import type { Event } from '$lib/types/event';
import type { TimeStruct } from '$lib/types/utils';
import dayjs from 'dayjs';

export function formatDate(dateString: string) {
	const date = new Date(dateString);
	let month = '' + (date.getMonth() + 1);
	let day = '' + date.getDate();
	const year = date.getFullYear();

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	return [year, month, day].join('-');
}

export const getEventsWithFutureDates = (events: Event[]) => {
	const results: Event[] = [];
	const today = new Date();

	events.forEach((event) => {
		if (new Date(event.startDate) > today) {
			results.push(event);
		}
	});

	return results;
};

export const getLastEvent = (events: Event[]) => {
	let resultEvent = events[0];
	const today = new Date();

	events.forEach((event) => {
		const start = new Date(event.startDate);
		if (!event.endDate) {
			if (dayjs(start).isBefore(today, 'day')) {
				if (!dayjs(resultEvent.startDate).isAfter(start, 'day')) {
					resultEvent = event;
				}
			}
		} else {
			const end = new Date(event.endDate);
			if (dayjs(end).isBefore(today, 'day')) {
				if (!dayjs(resultEvent.endDate).isAfter(end, 'day')) {
					resultEvent = event;
				}
			}
		}
	});

	return resultEvent;
};

export const getActiveEvents = (events: Event[]) => {
	const results: Event[] = [];
	const today = new Date();

	events.forEach((event) => {
		const start = new Date(event.startDate);

		if (event.startDate && event.endDate) {
			const end = new Date(event.endDate);
			if (start < today && today < end) {
				results.push(event);
			}
		} else {
			if (dayjs(start).isSame(today, 'day')) {
				results.push(event);
			}
		}
	});

	return results;
};

export const getRemainingTime = (countDownDate: Date) => {
	const now = new Date();
	const timeleft = countDownDate.getTime() - now.getTime();
	const remaining: TimeStruct = {};
	remaining.days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
	remaining.hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	remaining.minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
	remaining.seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
	return remaining;
};

export const compareDates = <T>(a: T, b: T) => {
	if (!a) return -1;
	const distantFuture = dayjs('02/10/2060');
	const dateA = a ? dayjs(a, 'DD.MM.YYYY') : distantFuture;
	const dateB = b ? dayjs(b, 'DD.MM.YYYY') : distantFuture;
	if (dateA.isBefore(dateB)) {
		return 1;
	} else if (dateB.isBefore(dateA)) {
		return -1;
	} else {
		return 0;
	}
};

