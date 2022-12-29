import { RemoteApiGroups } from '../../../api/groups';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const res = await RemoteApiGroups.getGroupById(params.id);
	return res;
}
