import Api from './RemoteAPI';
import type { Role } from '$lib/types/role';

export const RemoteApiRoles = {
	getAllRoles: async () => {
		try {
			const response = await Api.get('/roles/get/');
			return response.roles;
		} catch (error) {
			console.error(error);
		}
	},
	deleteRole: async (roleId: Role['_id']) => {
		try {
			const response = await Api.delete(`/roles/delete/${roleId}`);
			return response.role;
		} catch (error) {
			console.error(error);
		}
	},
	updateRole: async (roleId: Role['_id'], payload: Role) => {
		try {
			const response = await Api.patch(`/roles/update/${roleId}`, payload);
			return response.roleId;
		} catch (error) {
			console.error(error);
		}
	},
	createRole: async (payload: Role) => {
		try {
			const response = await Api.post(`/roles/create/`, payload);
			return response.roleId;
		} catch (error) {
			console.error(error);
		}
	},
	getRoleById: async (roleId: Role['_id']) => {
		try {
			const response = await Api.get(`/roles/get/${roleId}`);
			return response.roleId;
		} catch (error) {
			console.error(error);
		}
	}
};

// export const getAllRoles = async () => {
// 	try {
// 		const response = await Api.get('/roles/get/');
// 		return response.roles;
// 	} catch (error) {
// 		console.error(error);
// 	}
// };

// export const deleteRole = async (roleId) => {
// 	try {
// 		const response = await Api.delete(`/roles/delete/${roleId}`);
// 		return response.role;
// 	} catch (error) {
// 		console.error(error);
// 	}
// };

// export const updateRole = async (roleId, payload) => {
// 	try {
// 		const response = await Api.patch(`/roles/update/${roleId}`, payload);
// 		return response.roleId;
// 	} catch (error) {
// 		console.error(error);
// 	}
// };

// export const createRole = async (payload) => {
// 	try {
// 		const response = await Api.post(`/roles/create/`, payload);
// 		return response.roleId;
// 	} catch (error) {
// 		console.error(error);
// 	}
// };

// export const getRoleById = async (roleId) => {
// 	try {
// 		const response = await Api.get(`/roles/get/${roleId}`);
// 		return response.roleId;
// 	} catch (error) {
// 		console.error(error);
// 	}
// };
