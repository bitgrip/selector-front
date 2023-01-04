export interface AlertInfo {
	type: 'success' | 'error' | 'warning' | 'info';
	timer: number;
    text: string;
}
