import { RemoteApiItems } from '../../../../api/item';
import { serializeToResponse } from '$lib/apiClient/serializeToResponse';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params: {itemId} }) {
	return serializeToResponse(await RemoteApiItems.getItemById(itemId));
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ params: {itemId} }) {
	return serializeToResponse(await RemoteApiItems.deleteItem(itemId));
}

/** @type {import('./$types').RequestHandler} */
export async function PATCH({ request, params: { itemId } }) {
	return serializeToResponse(await RemoteApiItems.updateItem(itemId, await request.json()));
}
