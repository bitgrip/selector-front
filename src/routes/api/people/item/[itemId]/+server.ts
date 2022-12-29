import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { RemoteApiPeople } from '../../../../../api/people';

export const GET: RequestHandler = async ({ params: { itemId } }) => {
	return json(await RemoteApiPeople.getAllPeopleByItem(itemId));
};
