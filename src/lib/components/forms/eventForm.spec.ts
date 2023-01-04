import { describe, expect, it } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/svelte';
import EventForm from './EventForm.svelte';
import { mockedItems } from 'tests/mocks/mockedItems.js';
import { mockedSelectablePeople } from 'tests/mocks/mockedPeople.js';
import userEvent from '@testing-library/user-event';

describe('Test EventForm.svelte', async () => {
	it('Renders empty form correctly and sends collected data', async () => {
		const { component } = render(EventForm, {
			props: {
				title: 'create new event',
				peopleToSelectFrom: mockedSelectablePeople,
				item: mockedItems[0]
			}
		});
		let calledWith = {};

		const startDate = screen.getByLabelText('Start date*');
		// TODO i cant change the date in the input :(
		await act(() => {
			fireEvent.change(startDate, { target: { value: '2020-05-12' } }); // this doesnt work
		});

		const moderatorInput = await screen.findByPlaceholderText('Select moderator');
		await act(() => {
			userEvent.click(moderatorInput);
		});

		// this line is working but also causing error in the console
		// Error: Uncaught [TypeError: Failed to execute 'contains' on 'Node': parameter 1 is not of type 'Node'.]
		// weird is that the same dropdown in ItemForm is not causing any trouble

		// expect(await screen.findByText('Sven')).toBeInTheDocument();
		// screen.debug(null, Infinity);

		// I can also not click it :(
		// await act(() => {
		// 	userEvent.click(screen.getByText('Sven')); // this doesnt work
		// });

		expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();

		component.$on('submit', (e) => {
			calledWith = e.detail;
		});

		screen.getByRole('button', { name: 'Save' }).click();

		console.log(calledWith);
		expect(calledWith).toMatchObject({
			_id: '',
			startDate: '2023-01-01T06:00:00.000Z',
			endDate: '',
			participants: []
		});
	});
});
