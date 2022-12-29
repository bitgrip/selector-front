import type { Item } from './item';
import type { Participant } from './participant';
import type { dbInfo } from './utils';

export interface Event extends dbInfo {
	item: Item;
	startDate: string;
	endDate: string;
	participants: Array<Participant>;
}

export interface EventRequestType extends Omit<Event, 'item' | 'participants' | '_id'> {
	_id?: string;
	item?: string;
	participants: Array<{
		role: string;
		person: string;
	}>;
}
