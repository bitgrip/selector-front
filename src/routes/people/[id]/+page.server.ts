import { RemoteApiPeople } from '../../../api/people';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const res = await RemoteApiPeople.getPersonById(params.id);
	return res;
}
