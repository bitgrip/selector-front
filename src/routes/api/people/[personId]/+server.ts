import { RemoteApiPeople } from '../../../../api/people';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params: { personId } }) => {
	return json(await RemoteApiPeople.getPersonById(personId));
};

export const DELETE: RequestHandler = async ({ params: { personId } }) => {
	return json(await RemoteApiPeople.deletePerson(personId));
};

export const PATCH: RequestHandler = async ({ request, params: { personId } }) => {
	return json(await RemoteApiPeople.updatePerson(personId, await request.json()));
};
