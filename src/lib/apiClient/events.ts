import ClientAPI from '$lib/apiClient/ClientAPI.js';
import type {Event} from '$lib/types/event';

export const LocalApiEvents = {
	getEventById: async (eventId: string): Promise<Event> => {
		return await ClientAPI.get(`/events/${eventId}`);
	},
	/* TODO types for payloads */
	createEvent: async (payload: unknown): Promise<unknown> => {
		return await ClientAPI.post(`/events`, payload);
	},

	deleteEvent: async (eventId: string): Promise<void> => {
		return await ClientAPI.delete(`/events/${eventId}`);
	},

	/* TODO types for payloads */
	updateEvent: async (eventId: string, payload: unknown): Promise<void> => {
		return await ClientAPI.patch(`/events/${eventId}`, payload);
	}
};
