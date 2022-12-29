import type { Item } from './item';
import type { dbInfo } from './utils';

export interface Role extends dbInfo {
	name: string;
	description: string;
	icon: string;
	itemsUsingRole?: Array<Item>;
}
