import { expect, test, type Page } from '@playwright/test';
import * as dotenv from 'dotenv';
import { mockedGroups } from './mocks/mockedGroups.js';
import { mockedItems } from './mocks/mockedItems.js';
import { mockedRoles } from './mocks/mockedRoles.js';

dotenv.config();

let page: Page;

const mockedItemsRoute = (page: Page) => {
	return page.route('http://localhost:4173/api/items', (route) => {
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(mockedItems)
		});
	});
};

const mockedGroupsRoute = (page: Page) => {
	return page.route('http://localhost:4173/api/groups', (route) => {
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(mockedGroups)
		});
	});
};

const mockedRolesRoute = (page: Page) => {
	return page.route('http://localhost:4173/api/roles', (route) => {
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(mockedRoles)
		});
	});
};

test.beforeEach(async () => {
	await mockedItemsRoute(page);
	await mockedGroupsRoute(page);
	await mockedRolesRoute(page);
});

test.beforeAll(async ({ browser }) => {
	const context = await browser.newContext({
		httpCredentials: {
			username: process.env.VITE_ADMIN_LOGIN_NAME || '',
			password: process.env.VITE_ADMIN_LOGIN_PASS || ''
		}
	});
	page = await context.newPage();

	// Go to the starting url before each test.
	await page.goto('http://127.0.0.1:4173');
});

test('item page renders items', async () => {
	// will be integration test
	// await page.goto('/');
	// const divs = page.getByTestId('ItemCard');
	// await expect(divs).toHaveCount(3);
	// const firstCard = page.getByTestId('ItemCard').first();
	// console.log(firstCard)
	// expect(firstCard).toBeVisible();
	// expect(firstCard.getByRole('link', { name: 'Telling Secretss' })).toBeVisible();
	// expect(firstCard.getByTestId('ItemDescription')).toContainText(
	// 	'Telling Secrets Every Friday the deepest secrets are revealed.'
	// );
	// const badges = firstCard.getByTestId('RoleBadge');
	// expect(badges).toHaveCount(4);
	// expect(firstCard.getByText('Moderators')).toBeVisible();
	// expect(firstCard.getByText('Recorder')).toBeVisible();
});

test('item page, edit button, request is called with edited data', async () => {
	await page.goto('/');

	page.locator('.card-actions > button').first().click();

	await page.getByPlaceholder('Name of the item').fill('Telling Secrets Change');
	await page
		.getByPlaceholder('Write the description here')
		.fill('Every Friday the deepest secrets are revealed. Change');
	await page.getByPlaceholder('Select..').click();
	await page.getByRole('dialog').getByText('The curious one').click();
	await page.locator('.badge').locator('div', { hasText: 'The curious one' }).isVisible();
	// await page.locator('.badge >> [text=The curious one]').isVisible()
	await page.locator('.badge').locator('div', { hasText: 'The curious one' }).isVisible();
	await page.locator('#DeleteIcon').first().click();
	const [request] = await Promise.all([
		page.waitForRequest((resp) => resp.url().includes('api/item') && resp.method() === 'PATCH'),
		page.getByRole('button', { name: 'Save' }).click()
	]);

	expect(request.method()).toBe('PATCH');

	expect(await JSON.parse(request.postData() as string)).toMatchObject({
		_id: '636b4b8d01f350e3c2177972',
		name: 'Telling Secrets Change',
		roles: [
			{
				_id: '636b4bfb01f350e3c217797c',
				name: 'Recorder',
				description: 'Also known as Protokollant, writes everything said down. ',
				icon: 'faUserEdit',
				itemsUsingRole: []
			},
			{
				_id: '636b52c75a9aec44e64f8c2e',
				name: 'The curious one',
				description: 'Truthseeker!',
				icon: 'faCircleQuestion',
				itemsUsingRole: []
			}
		],
		description: 'Every Friday the deepest secrets are revealed. Change',
		isLongerThenOneDay: false,
		groupes: ['6371224a40d8a5954f19b1aa']
	});
});
