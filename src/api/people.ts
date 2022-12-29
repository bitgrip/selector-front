import type { Person } from '$lib/types/person';
import RemoteAPI from './RemoteAPI';

export const RemoteApiPeople = {
	getAllPeople: async (): Promise<Person[]> => {
		try {
			const response = await RemoteAPI.get('/person/get/');
			return response.persons;
		} catch (error) {
			console.error(error);
			return [];
		}
	},
	getPersonById: async (personId?: string) => {
		try {
			const response = await RemoteAPI.get(`/person/get/${personId}`);
			return response.personId;
		} catch (error) {
			console.error(error);
		}
	},
	getAllPeopleByItem: async (itemId?: string): Promise<Person[]> => {
		try {
			const response = await RemoteAPI.get(`/person/get/?item=${itemId}`);
			return response.persons;
		} catch (error) {
			console.error(error);
			return [];
		}
	},
	getAllPersonEvents: async (personId?: string): Promise<Event[]> => {
		try {
			const response = await RemoteAPI.get(`/person/get/${personId}/summary`);
			return response.attendedEvents;
		} catch (error) {
			console.error(error);
			return [];
		}
	},

	deletePerson: async (personId?: string) => {
		try {
			const response = await RemoteAPI.delete(`/person/delete/${personId}`);
			return response.message;
		} catch (error) {
			console.error(error);
		}
	},
	updatePerson: async (personId?: string, payload?: Person) => {
		try {
			const response = await RemoteAPI.patch(`/person/update/${personId}`, payload);
			return response.personId;
		} catch (error) {
			console.error(error);
		}
	},
	createPerson: async (payload?: Person) => {
		try {
			const response = await RemoteAPI.post(`/person/create/`, payload);
			return response.personId;
		} catch (error) {
			console.error(error);
		}
	}
};
