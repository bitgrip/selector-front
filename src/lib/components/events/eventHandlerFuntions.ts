import type { Event, EventRequestType } from '$lib/types/event';

import type { Item } from '$lib/types/item';
import { LocalApiEvents } from '$lib/apiClient/events';

export const handleCreateNewEvent = async (event: EventRequestType, item: Item) => {
	const payload = {
		item: item._id,
		startDate: event.startDate,
		endDate: event.endDate,
		participants: event.participants,
		eventNote: event.eventNote
	};
	return await LocalApiEvents.createEvent(payload);
};

export const handleUpdateEvent = async (event: EventRequestType) => {
	if (event._id) {
		return await LocalApiEvents.updateEvent(event._id, {
			startDate: event.startDate,
			endDate: event.endDate,
			participants: event.participants,
			eventNote: event.eventNote
		});
	}
};

export const handleDeleteEvent = async (event: Event) => {
	return await LocalApiEvents.deleteEvent(event._id);
};
