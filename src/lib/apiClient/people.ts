import ClientAPI from '$lib/apiClient/ClientAPI.js';
import type { Event } from '$lib/types/event';
import type { Person } from '$lib/types/person';

export const LocalApiPeople = {
	getAllPeople: async (): Promise<Person[]> => {
		return await ClientAPI.get(`/people`);
	},
	getPersonById: async (personId: string): Promise<Person> => {
		return await ClientAPI.get(`/people/${personId}`);
	},
	getAllPeopleByItem: async (itemId: string): Promise<Person[]> => {
		return await ClientAPI.get(`/people/item/${itemId}`);
	},
	getAllPersonEvents: async (personId: string): Promise<Event[]> => {
		return await ClientAPI.get(`/people/${personId}/summary`);
	},
	deletePerson: async (personId: string): Promise<unknown> => {
		return await ClientAPI.delete(`/people/${personId}`);
	},
	updatePerson: async (personId: string, payload: unknown): Promise<unknown> => {
		return await ClientAPI.patch(`/people/${personId}`, payload);
	},
	createPerson: async (payload: unknown): Promise<unknown> => {
		return await ClientAPI.post(`/people`, payload);
	}
};
