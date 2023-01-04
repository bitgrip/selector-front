import type { Item, ItemRequestType } from '$lib/types/item';

import { LocalApiItems } from '$lib/apiClient/items';

export const handleCreateNewItem = async (event: CustomEvent<ItemRequestType>) => {
	return await LocalApiItems.createItem(event.detail);
};

export const handleDeleteItem = async (itemId: Item['_id']) => {
	try {
		const response = await LocalApiItems.deleteItem(itemId);
		if (response) {
			return response;
		} else {
			return Promise.reject('error during item deletion');
		}
	} catch (error) {
		return Promise.reject('error during item deletion');
 	}
};

export const handleEditItem = async (event: CustomEvent<ItemRequestType>, itemId: Item['_id']) => {
	return await LocalApiItems.updateItem(itemId, event.detail);
};

export const getAllPeopleAndRoleCount = async (itemId: Item['_id']) => {
	return await LocalApiItems.getItemPeopleAttendance(itemId);
};

export const getItemEvents = async (
	itemId: Item['_id'],
	timeRange?: string | undefined,
	limit?: string | undefined
) => {
	return await LocalApiItems.getItemEvents(itemId, timeRange, limit);
};
