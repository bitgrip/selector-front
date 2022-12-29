export interface Attendance {
	[index: string]: Array<{
		name: string;
		_id: string;
		active: boolean;
		attended: number;
		latestDate: string;
		dates: Array<string>;
	}>;
}
