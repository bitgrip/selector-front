import { RemoteApiItems } from '../../../../../api/item';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params: { itemId } }) => {
	return json(await RemoteApiItems.getItemRecentEvents(itemId));
};
