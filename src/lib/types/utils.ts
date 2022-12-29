export type TimeStruct = {
	days?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
};

export interface dbInfo {
	_id: string;
	createdAt?: string;
	updatedAt?: string;
	__v?: string;
}
