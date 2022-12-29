import type { Person } from './person';
import type { Role } from './role';
import type { dbInfo } from './utils';

export interface Participant extends dbInfo{
	role: Role;
	person: Person;
}
 