import type { Group } from './group';
import type { Role } from './role';
import type { dbInfo } from './utils';

export interface Item extends dbInfo {
	name: string;
	roles: Array<Role>;
	description: string;
	isLongerThenOneDay: boolean;
	// item can only be in one group, it is still an array because of legacy i guess
	groupes: Array<Group>;
}

export interface ItemRequestType extends Omit<Item, 'roles' | 'groupes' | '_id'> {
	_id?: string;
	roles?: Array<string>;
	groupes?: Array<string>;
}
