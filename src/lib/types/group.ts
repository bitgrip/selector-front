import type { Item } from './item';
import type { dbInfo } from './utils';

export interface Group extends dbInfo {
	_id: string;
	name: string;
	description?: string;
	items: Array<Item>;
}

export interface GroupWithItemDetails extends Group {
	group: Group;
	allRotationItems: Array<Item>;
}

export interface GroupRequestType extends Omit<Group, 'items' | '_id'> {
	_id?: string;
	items?: Array<string>;
}
