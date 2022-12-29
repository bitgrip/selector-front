import { RemoteApiItems } from '../../../api/item';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return json(await RemoteApiItems.getAllItems());
};

export const POST: RequestHandler = async ({ request }) => {
	return json(await RemoteApiItems.createItem(await request.json()));
};
