import ClientAPI from '$lib/apiClient/ClientAPI.js';
import type { Role } from '$lib/types/role';

export const LocalApiRoles = {
	getAllRoles: async (): Promise<Array<Role>> => {
		return await ClientAPI.get(`/roles`);
	},
	getRoleById: async (roleId: Role['_id']): Promise<Role> => {
		return await ClientAPI.get(`/roles/${roleId}`);
	},
	createRole: async (payload: Role): Promise<unknown> => {
		return await ClientAPI.post(`/roles`, payload);
	},
	deleteRole: async (roleId: Role['_id']): Promise<void> => {
		return await ClientAPI.delete(`/roles/${roleId}`);
	},
	updateRole: async (roleId: Role['_id'], payload: Role): Promise<void> => {
		return await ClientAPI.patch(`/roles/${roleId}`, payload);
	}
};
