import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';

import RoleBadge from './RoleBadge.svelte';
import { mockedRoles } from 'tests/mocks/mockedRoles.js';

describe('Test RoleBadge.svelte', async () => {
	it('Renders badge without delete button correctly', async () => {
		render(RoleBadge, { role: mockedRoles[0] });
		expect(screen.getByTestId('RoleBadge')).toBeInTheDocument();
		expect(screen.getByText('Moderator')).toBeInTheDocument();
		expect(screen.queryByTestId('DeleteIcon')).not.toBeInTheDocument();
	});

	it('Renders badge delete button correctly', async () => {
		render(RoleBadge, { role: mockedRoles[0], deleteButton: true });
		expect(screen.getByTestId('RoleBadge')).toBeInTheDocument();
		expect(screen.getByText('Moderator')).toBeInTheDocument();
		expect(screen.getByTestId('DeleteIcon')).toBeInTheDocument();
	});

	it.only('Click on delete button dispatches delete event', async () => {
		const { component } = render(RoleBadge, {
			props: { role: mockedRoles[0], deleteButton: true }
		});

		const mock = vi.fn();
		component.$on('delete', mock);
		screen.getByTestId('DeleteIcon').click();
		expect(mock).toHaveBeenCalled();
	});
});
