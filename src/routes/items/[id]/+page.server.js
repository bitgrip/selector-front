import { RemoteApiItems } from '../../../api/item';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const res = await RemoteApiItems.getItemById(params.id);
	return res;
}
