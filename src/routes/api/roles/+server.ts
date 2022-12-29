import { RemoteApiRoles } from '../../../api/roles';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return json(await RemoteApiRoles.getAllRoles());
};

export const POST: RequestHandler = async ({ request }) => {
	return json(await RemoteApiRoles.createRole(await request.json()));
};
