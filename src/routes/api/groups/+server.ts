import { RemoteApiGroups } from '../../../api/groups';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return json(await RemoteApiGroups.getAllGroups());
};

export const POST: RequestHandler = async ({ request }) => {
	return json(await RemoteApiGroups.createGroup(await request.json()));
};
