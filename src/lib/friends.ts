export interface FriendSocial {
	label: string;
	url: string;
}

export interface Friend {
	name: string;
	discordUsername: string;
	discordUrl: string;
	description: string;
	socials: FriendSocial[];
}

// Add or remove entries here. Nothing else needs to change.
export const friends: Friend[] = [
	{
		name: 'Matteo',
		discordUsername: '@matteo',
		discordUrl: 'https://discord.com/users/000000000000000000',
		description: 'Core team member at Opus Host. Keeps things running when I am busy breaking a Proxmox VM.',
		socials: [
			{ label: 'GitHub', url: 'https://github.com/matteo' },
			{ label: 'Discord Server', url: 'https://discord.gg/opushost' }
		]
	},
	{
		name: 'Len',
		discordUsername: '@len',
		discordUrl: 'https://discord.com/users/000000000000000000',
		description: 'Core team member at Opus Host.',
		socials: [{ label: 'GitHub', url: 'https://github.com/len' }]
	},
	{
		name: 'Tobias',
		discordUsername: '@tobias',
		discordUrl: 'https://discord.com/users/000000000000000000',
		description: 'Core team member at Opus Host.',
		socials: [{ label: 'GitHub', url: 'https://github.com/tobias' }]
	},
	{
		name: 'Luan',
		discordUsername: '@luan',
		discordUrl: 'https://discord.com/users/000000000000000000',
		description: 'Core team member at Opus Host.',
		socials: [{ label: 'GitHub', url: 'https://github.com/luan' }]
	}
];
