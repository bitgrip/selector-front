import { RemoteApiItems } from 'api/item';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params: { itemId }, url }) => {
	const timeRange = url.searchParams.get('timeRange');
	const limit = url.searchParams.get('limit');

	return json(await RemoteApiItems.getItemEvents(itemId, timeRange, limit));
};
