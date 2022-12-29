import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { RemoteApiPeople } from '../../../../../api/people';

export const GET: RequestHandler = async ({ params: { personId } }) => {
	return json(await RemoteApiPeople.getAllPersonEvents(personId));
};
