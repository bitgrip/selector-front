import { RemoteApiEvents } from 'api/event';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params: { eventId } }) => {
	return json(await RemoteApiEvents.getEventById(eventId));
};

export const DELETE: RequestHandler = async ({ params: { eventId } }) => {
	return json(await RemoteApiEvents.deleteEvent(eventId));
};

export const PATCH: RequestHandler = async ({ request, params: { eventId } }) => {
	return json(await RemoteApiEvents.updateEvent(eventId, await request.json()));
};
