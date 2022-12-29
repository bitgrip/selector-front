import ClientAPI from '$lib/apiClient/ClientAPI.js';
import type { Group } from '$lib/types/group';

export const LocalApiGroups = {
	getAllGroups: async (): Promise<Array<Group>> => {
		return await ClientAPI.get(`/groups`);
	},
	getGroupById: async (groupId: string): Promise<Group> => {
		return await ClientAPI.get(`/groups/${groupId}`);
	},
	createGroup: async (payload: unknown): Promise<unknown> => {
		return await ClientAPI.post(`/groups`, payload);
	},
	deleteGroup: async (groupId: string): Promise<void> => {
		return await ClientAPI.delete(`/groups/${groupId}`);
	},
	updateGroup: async (groupId: string, payload: unknown): Promise<void> => {
		return await ClientAPI.patch(`/groups/${groupId}`, payload);
	}
};
