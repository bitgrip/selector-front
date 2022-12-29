import { RemoteApiEvents } from '../../../api/event';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	return json(await RemoteApiEvents.createEvent(await request.json()));
};
