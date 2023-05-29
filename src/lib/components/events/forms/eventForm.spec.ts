import { describe, expect, it } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/svelte';
import EventFormModal from './EventFormModal.svelte';
import {
	mockedItemNoPredefinedLenghtNoAutoStartDate,
	mockedItemPredefinedLenghtAutoStartDate,
	mockedItemPredefinedLenghtNoAutoStartDate
} from 'tests/mocks/mockedItems.js';
import { mockedSelectablePeople } from 'tests/mocks/mockedPeople.js';

beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
});

describe.only('Test EventForm.svelte', async () => {
	describe.only('start and end dates', async () => {
		it.only('handles new event with item with no predefined lenght and no automatic start dates correctly', async () => {
			const date = new Date(2023, 1, 1, 13, 10);
			vi.setSystemTime(date);
			// let calledWith = {};

			const { component } = render(EventFormModal, {
				props: {
					peopleToSelectFrom: mockedSelectablePeople,
					item: mockedItemNoPredefinedLenghtNoAutoStartDate
				}
			});

			// const saveButton = await screen.findByRole('button', { name: 'Save', hidden: true });
			const closeButton = await screen.findByRole('button', { name: 'Close', hidden: true });
			expect(closeButton).toBeInTheDocument();

			const startDate: HTMLInputElement = screen.getByLabelText('Start date*');
			expect(startDate.value).toBe('2023-02-01');

			const endDate: HTMLInputElement = screen.getByLabelText('End date*');
			expect(endDate.value).toBe('');

			// this is not really setting the date :(
			await act(() => {
				fireEvent.change(startDate, { target: { value: '2023-05-12' } });
			});
			expect(startDate.value).toBe('2023-05-12');
			expect(endDate.value).toBe('');

			// // this is not really setting the date :(
			// await act(() => {
			// 	fireEvent.change(endDate, { target: { value: '2023-07-19' } });
			// });
			// expect(endDate.value).toBe('2023-07-19');

			// // so this doesnt work
			// component.$on('submit', (e) => {
			// 	console.log(e);
			// 	calledWith = e;
			// });
			// saveButton.click();
			// expect(calledWith).toMatchObject({
			// 	_id: '',
			// 	startDate: '2023-01-01T06:00:00.000Z',
			// 	endDate: '',
			// 	participants: []
			// });
		});

		it.only('handles new event with item with predefined lenght and no automatic start dates correctly', async () => {
			const date = new Date(2023, 1, 1, 13, 10);
			vi.setSystemTime(date);

			const { component } = render(EventFormModal, {
				props: {
					peopleToSelectFrom: mockedSelectablePeople,
					item: mockedItemPredefinedLenghtNoAutoStartDate
				}
			});

			// const saveButton = await screen.findByRole('button', { name: 'Save', hidden: true });
			const closeButton = await screen.findByRole('button', { name: 'Close', hidden: true });
			expect(closeButton).toBeInTheDocument();

			const startDate: HTMLInputElement = screen.getByLabelText('Start date*');
			expect(startDate.value).toBe('2023-02-01');

			const endDate: HTMLInputElement = screen.getByLabelText(
				'End date (predefined length 5 days)*'
			);
			expect(endDate.value).toBe('2023-02-05');

			// this is not really setting the date :(
			// await act(() => {
			//     userEvent.type(endDate, '2021-11-09'); // type anything

			// 	// fireEvent.change(endDate, { target: { value: '2023-07-19' } });
			// });
			// expect(endDate.value).toBe('2023-07-19');

			// so this doesnt work
			// component.$on('submit', (e) => {
			// 	console.log(e);
			// 	calledWith = e;
			// });
			// saveButton.click();
			// expect(calledWith).toMatchObject({
			// 	_id: '',
			// 	startDate: '2023-01-01T06:00:00.000Z',
			// 	endDate: '',
			// 	participants: []
			// });
		});

		it.only('handles new event with item with predefined lenght and automatic start dates correctly', async () => {
			const date = new Date(2023, 1, 1, 13, 10);
			vi.setSystemTime(date);

			const { component } = render(EventFormModal, {
				props: {
					peopleToSelectFrom: mockedSelectablePeople,
					item: mockedItemPredefinedLenghtAutoStartDate,
					lastItemEvent: {
						startDate: '2023-02-01T06:00:00.000Z',
						endDate: '2023-02-05T06:00:00.000Z'
					}
				}
			});

			// const saveButton = await screen.findByRole('button', { name: 'Save', hidden: true });
			const closeButton = await screen.findByRole('button', { name: 'Close', hidden: true });
			expect(closeButton).toBeInTheDocument();

			const startDate: HTMLInputElement = screen.getByLabelText('Start date*');
			expect(startDate.value).toBe('2023-02-06');

			const endDate: HTMLInputElement = screen.getByLabelText(
				'End date (predefined length 5 days)*'
			);
			expect(endDate.value).toBe('2023-02-10');
		});

		it.only('handles existing event correctly', async () => {
			const date = new Date(2023, 1, 1, 13, 10);
			vi.setSystemTime(date);

			const { component } = render(EventFormModal, {
				props: {
					peopleToSelectFrom: mockedSelectablePeople,
					item: mockedItemPredefinedLenghtAutoStartDate,
					lastItemEvent: {
						startDate: '2023-02-01T06:00:00.000Z',
						endDate: '2023-02-05T06:00:00.000Z'
					},
					event: {
						_id: '123',
						startDate: '2023-02-07T06:00:00.000Z',
						endDate: '2023-02-10T06:00:00.000Z',
						participants: [
							{
								role: {
									_id: '123',
									name: 'Participant'
								},
								person: {
									_id: '123',
									name: 'John Doe'
								}
							}
						]
					}
				}
			});

			const closeButton = await screen.findByRole('button', { name: 'Close', hidden: true });
			expect(closeButton).toBeInTheDocument();

			const startDate: HTMLInputElement = screen.getByLabelText('Start date*');
			expect(startDate.value).toBe('2023-02-07');

			const endDate: HTMLInputElement = screen.getByLabelText(
				'End date (predefined length 5 days)*'
			);
			expect(endDate.value).toBe('2023-02-10');
		});
	});

	// it('Renders empty form correctly and sends collected data', async () => {
	// 	const { component } = render(EventFormModal, {
	// 		props: {
	// 			peopleToSelectFrom: mockedSelectablePeople,
	// 			item: mockedItems[0]
	// 		}
	// 	});
	// 	let calledWith = {};

	// 	const startDate = screen.getByLabelText('Start date*');
	// 	// TODO i cant change the date in the input :(
	// 	await act(() => {
	// 		fireEvent.change(startDate, { target: { value: '2020-05-12' } }); // this doesnt work
	// 	});

	// 	const moderatorInput = await screen.findByPlaceholderText('Select moderator');
	// 	await act(() => {
	// 		userEvent.click(moderatorInput);
	// 	});

	// 	// this line is working but also causing error in the console
	// 	// Error: Uncaught [TypeError: Failed to execute 'contains' on 'Node': parameter 1 is not of type 'Node'.]
	// 	// weird is that the same dropdown in ItemForm is not causing any trouble

	// 	// expect(await screen.findByText('Sven')).toBeInTheDocument();
	// 	// screen.debug(null, Infinity);

	// 	// I can also not click it :(
	// 	// await act(() => {
	// 	// 	userEvent.click(screen.getByText('Sven')); // this doesnt work
	// 	// });

	// 	// expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
	// 	const saveButton = await screen.findByRole('button', { name: 'Save', hidden: true });
	// 	const closeButton = await screen.findByRole('button', { name: 'Close', hidden: true });
	// 	// expect(screen.getByText('Close')).toBeInTheDocument();

	// 	component.$on('submit', (e) => {
	// 		calledWith = e.detail;
	// 	});

	// 	saveButton.click();

	// 	// console.log(calledWith);
	// 	expect(calledWith).toMatchObject({
	// 		_id: '',
	// 		startDate: '2023-01-01T06:00:00.000Z',
	// 		endDate: '',
	// 		participants: []
	// 	});
	// });
});
