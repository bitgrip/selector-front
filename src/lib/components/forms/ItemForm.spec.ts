import { describe, expect, it } from 'vitest';
import {
	act,
	render,
	screen,
	waitForElementToBeRemoved,
	within
} from '@testing-library/svelte';

import ItemForm from './ItemForm.svelte';
import { mockedGroups } from 'tests/mocks/mockedGroups.js';
import { mockedItems } from 'tests/mocks/mockedItems.js';
import { mockedRoles } from 'tests/mocks/mockedRoles.js';
import userEvent from '@testing-library/user-event';

describe('Test ItemForm.svelte', async () => {
	it('Renders empty form correctly and sends collected data', async () => {
		const { component } = render(ItemForm, {
			props: { allGroupes: mockedGroups, allRoles: mockedRoles }
		});
		const user = userEvent.setup();
		let calledWith = {};

		const nameInput = screen.getByRole('textbox', { name: 'Name*' });
		await user.type(nameInput, 'Test Item');

		const descriptionInput = screen.getByRole('textbox', { name: 'Description' });
		await user.type(descriptionInput, 'Test Description');

		const intervalToggle = screen.getByRole('checkbox', { name: 'Interval tracking?' });
		intervalToggle.click();

		expect(screen.getByRole('radio', { name: 'KSB' })).toBeInTheDocument();
		expect(screen.getByRole('radio', { name: 'Bitgrip' })).toBeInTheDocument();

		await act(() => screen.getByRole('radio', { name: 'KSB' }).click());

		const inputNode = await screen.findByPlaceholderText('Select..');
		await act(() => {
			userEvent.click(inputNode);
		});

		expect(await screen.findByText('Moderator')).toBeInTheDocument();
		expect(await screen.findByText('Recorder')).toBeInTheDocument();
		expect(await screen.findByText('The curious one')).toBeInTheDocument();
		expect(await screen.findByText('Main Guardian')).toBeInTheDocument();
		expect(await screen.findByText('Support Guardian')).toBeInTheDocument();

		await act(() => {
			userEvent.click(screen.getByText('Support Guardian'));
		});

		expect(await screen.findByTestId('RoleBadge')).toBeInTheDocument();

		expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();

		component.$on('submit', (e) => {
			calledWith = e.detail;
		});

		screen.getByRole('button', { name: 'Save' }).click();
		expect(calledWith).toMatchObject({
			_id: '',
			isLongerThenOneDay: true,
			description: 'Test Description',
			name: 'Test Item',
			groupes: ['6371223b40d8a5954f19b1a5'],
			roles: ['636e10adaf4383c4e81c83a1']
		});
	});

	it('Renders prefilled form correctly and sends changed data', async () => {
		const { component } = render(ItemForm, {
			props: {
				item: mockedItems[0],
				allGroupes: mockedGroups,
				allRoles: mockedRoles
			}
		});
		const user = userEvent.setup();
		let calledWith = {};

		const nameInput = screen.getByRole('textbox', { name: 'Name*' });
		await user.type(nameInput, ' Changed');

		const descriptionInput = screen.getByRole('textbox', { name: 'Description' });
		await user.type(descriptionInput, ' Changed');

		const intervalToggle = screen.getByRole('checkbox', { name: 'Interval tracking?' });
		intervalToggle.click();

		expect(screen.getByRole('radio', { name: 'KSB' })).toBeInTheDocument();
		expect(screen.getByRole('radio', { name: 'Bitgrip' })).toBeInTheDocument();
		await act(() => screen.getByRole('radio', { name: 'KSB' }).click());

		expect(await screen.findByText('Moderator')).toBeInTheDocument();
		expect(await screen.findByText('Recorder')).toBeInTheDocument();

		// remove recorder role
		const recorderBadgeDeleteIcon = within(screen.getByText('Recorder')).getByTestId('DeleteIcon');
		expect(recorderBadgeDeleteIcon).toBeInTheDocument();
		await act(() => {
			userEvent.click(recorderBadgeDeleteIcon);
		});
		await waitForElementToBeRemoved(() => screen.getByText('Recorder'));

		expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();

		component.$on('submit', (e) => {
			calledWith = e.detail;
		});

		screen.getByRole('button', { name: 'Save' }).click();

		expect(calledWith).toMatchObject({
			_id: '636b4b8d01f350e3c2177972',
			isLongerThenOneDay: true,
			description: 'Every Friday the deepest secrets are revealed.  Changed',
			name: 'Telling Secrets Changed',
			groupes: ['6371223b40d8a5954f19b1a5'],
			roles: ['636b4baa01f350e3c2177978']
		});
	});
});
