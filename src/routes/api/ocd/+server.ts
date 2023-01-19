import type { RequestHandler } from './$types';
import opsGenieRequest from 'api/OpsGenieCall';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return json(await opsGenieRequest());
};
