import { RemoteApiPeople } from '../../../api/people';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return json(await RemoteApiPeople.getAllPeople());
};

export const POST: RequestHandler = async ({ request }) => {
	return json(await RemoteApiPeople.createPerson(await request.json()));
};
