import { LocalApiPeople } from '$lib/apiClient/people';
import type { Person } from '$lib/types/person';
import type { SvelteSelectableItem } from '$lib/types/svelte-select/detail';

export const getAllSelectablePeople = async (itemId: Person['_id']) => {
	const res = await LocalApiPeople.getAllPeopleByItem(itemId);
	const selectablePeople: Array<SvelteSelectableItem> = [];

	res.map((person) => {
		if (person.active) {
			selectablePeople.push({ value: person._id, label: person.name });
		}
	});

	return selectablePeople;
};

export const getAllEventsForPerson = async (personId: Person['_id']) => {
	return await LocalApiPeople.getAllPersonEvents(personId);
};
