import type { Event } from '$lib/types/event';
import RemoteAPI from './RemoteAPI';

export const RemoteApiEvents = {
	getAllEventsForItem: async (itemId?: string): Promise<Event[]> => {
		try {
			const response = await RemoteAPI.get(`/rotationEvents/get/?item=${itemId}`);
			return response.rotationEvents;
		} catch (error) {
			console.error(error);
			return [];
		}
	},

	deleteEvent: async (eventId?: string): Promise<unknown> => {
		try {
			const response = await RemoteAPI.delete(`/rotationEvents/delete/${eventId}`)
			return response.message;
		} catch (error) {
			console.error(error);
		}
	},

	updateEvent: async (eventId?: string, payload?: Event): Promise<unknown> => {
		try {
			const response = await RemoteAPI.patch(`/rotationEvents/update/${eventId}`, payload);
			return response.rotationEvent;
		} catch (error) {
			console.error(error);
		}
	},

	createEvent: async (payload: Event) => {
		try {
			const response = await RemoteAPI.post(`/rotationEvents/create/`, payload);
			return response.rotationEvent;
		} catch (error) {
			console.error(error);
		}
	},

	getEventById: async (eventId: string): Promise<Event | null> => {
		try {
			const response = await RemoteAPI.get(`/rotationEvents/get/${eventId}`);
			return response.rotationEventId;
		} catch (error) {
			console.error(error);
			return null;
		}
	}
};
