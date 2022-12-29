import type { Group } from './group';
import type { Item } from './item';
import type { dbInfo } from './utils';

export interface Person extends dbInfo {
	name: string;
	active?: boolean;
	itemsCanBeAttended?: Array<Item> | Array<string>;
	groupes?: Array<Group>;
}
