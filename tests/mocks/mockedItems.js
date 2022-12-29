export const mockedItems = [
	{
		_id: '636b4b8d01f350e3c2177972',
		name: 'Telling Secrets',
		roles: [
			{
				_id: '636b4baa01f350e3c2177978',
				name: 'Moderator',
				description: 'Should talk when everyone else is quiet. ',
				icon: 'faMicrophone',
				itemsUsingRole: []
			},
			{
				_id: '636b4bfb01f350e3c217797c',
				name: 'Recorder',
				description: 'Also known as Protokollant, writes everything said down. ',
				icon: 'faUserEdit',
				itemsUsingRole: []
			}
		],
		description: 'Every Friday the deepest secrets are revealed. ',
		isLongerThenOneDay: false,
		groupes: [
			{ _id: '6371224a40d8a5954f19b1aa', name: 'Bitgrip', description: 'all the bitgrip people' }
		]
	},
	{
		_id: '636b51ce5a9aec44e64f8c24',
		name: 'Friday Checkout',
		roles: [
			{
				_id: '636b52c75a9aec44e64f8c2e',
				name: 'The curious one',
				description: 'Truthseeker!',
				icon: 'faCircleQuestion',
				itemsUsingRole: []
			}
		],
		description: 'Ask a question! ',
		isLongerThenOneDay: false,
		groupes: [
			{ _id: '6371224a40d8a5954f19b1aa', name: 'Bitgrip', description: 'all the bitgrip people' }
		]
	},
	{
		_id: '636e10dfaf4383c4e81c83a8',
		name: 'KSB AT Guardians',
		roles: [
			{
				_id: '636e0fc7af4383c4e81c839d',
				name: 'Main Guardian',
				description: 'Is the main and driving role for the task.',
				icon: 'faShieldHalved',
				itemsUsingRole: []
			},
			{
				_id: '636e10adaf4383c4e81c83a1',
				name: 'Support Guardian',
				description: 'Helps the main guardian.',
				icon: 'faShield',
				itemsUsingRole: []
			}
		],
		description: 'Keeping KSB E2E Tests green! ',
		isLongerThenOneDay: false,
		groupes: [{ _id: '6371223b40d8a5954f19b1a5', name: 'KSB', description: 'proud ksb team' }]
	}
];
