import type { Group } from '$lib/types/group';
import RemoteApi from './RemoteAPI';

export const RemoteApiGroups = {
	getAllGroups: async () => {
		try {
			const response = await RemoteApi.get('/groups/get/');
			return response.groups;
		} catch (error) {
			console.error(error);
		}
	},
	deleteGroup: async (groupId: Group['_id']) => {
		try {
			const response = await RemoteApi.delete(`/groups/delete/${groupId}`);
			return response.group;
		} catch (error) {
			console.error(error);
		}
	},
	updateGroup: async (groupId: Group['_id'], payload: Group) => {
		try {
			const response = await RemoteApi.patch(`/groups/update/${groupId}`, payload);
			return response.groupId;
		} catch (error) {
			console.error(error);
		}
	},
	createGroup: async (payload: Group) => {
		try {
			const response = await RemoteApi.post(`/groups/create/`, payload);
			return response.groupId;
		} catch (error) {
			console.error(error);
		}
	},
	getGroupById: async (groupId: Group['_id']) => {
		try {
			const response = await RemoteApi.get(`/groups/get/${groupId}`);
 			return response.group;
		} catch (error) {
			console.error(error);
		}
	}
};
