import type { Item, ItemRequestType } from '$lib/types/item';

import type { Attendance } from '$lib/types/attendance';
import ClientAPI from '$lib/apiClient/ClientAPI.js';
import type { Event } from '$lib/types/event';

export const LocalApiItems = {
	getAllEvents: async (itemId: string): Promise<Event[]> => {
		return await ClientAPI.get(`/items/${itemId}/events`);
	},

	getAllItems: async (): Promise<Item[]> => {
		return await ClientAPI.get(`/items`);
	},

	getItem: async (itemId: string): Promise<Item> => {
		return await ClientAPI.get(`/items/${itemId}`);
	},

	getItemEvents: async (itemId: string, timeRange?: string, limit?: string): Promise<Event[]> => {
		const urlSearchParams = new URLSearchParams();

		if (timeRange) {
			urlSearchParams.append('timeRange', timeRange);
		}
		if (limit) {
			urlSearchParams.append('limit', limit.toString());
		}

		return await ClientAPI.get(
			`/items/${itemId}/events${urlSearchParams && `?${urlSearchParams}`}`
		);
	},

	/* TODO types for return */
	getItemPeopleAttendance: async (itemId: string): Promise<Attendance> => {
		return await ClientAPI.get(`/items/${itemId}/attendance`);
	},

	/* TODO types for payloads and return */
	createItem: async (payload: unknown): Promise<unknown> => {
		return await ClientAPI.post(`/items`, payload);
	},

	/* TODO types for return */
	deleteItem: async (itemId: string): Promise<unknown> => {
		return await ClientAPI.delete(`/items/${itemId}`);
	},

	/* TODO types for payloads and return */
	updateItem: async (itemId: string, payload: ItemRequestType): Promise<unknown> => {
		return await ClientAPI.patch(`/items/${itemId}`, payload);
	}
};
