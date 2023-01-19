import ClientAPI from '$lib/apiClient/ClientAPI.js';
import type { OpsGenieResponse } from 'components/bitgrip/types';

export const getOcdAgent = async (): Promise<OpsGenieResponse> => {
	return await ClientAPI.get(`/ocd`);
};
