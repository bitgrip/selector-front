import { RemoteApiGroups } from '../../../../api/groups';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params: { groupId } }) => {
	return json(await RemoteApiGroups.getGroupById(groupId));
};

export const DELETE: RequestHandler = async ({ params: { groupId } }) => {
	return json(await RemoteApiGroups.deleteGroup(groupId));
};

export const PATCH: RequestHandler = async ({ request, params: { groupId } }) => {
	return json(await RemoteApiGroups.updateGroup(groupId, await request.json()));
};
