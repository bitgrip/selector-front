import { RemoteApiRoles } from '../../../../api/roles';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params: { roleId } }) => {
	return json(await RemoteApiRoles.getRoleById(roleId));
};

export const DELETE: RequestHandler = async ({ params: { roleId } }) => {
	return json(await RemoteApiRoles.deleteRole(roleId));
};

export const PATCH: RequestHandler = async ({ request, params: { roleId } }) => {
	return json(await RemoteApiRoles.updateRole(roleId, await request.json()));
};
