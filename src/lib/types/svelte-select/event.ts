import { SvelteSelectDetail } from './detail';

export interface SvelteSelectEvent {
	isTrusted: boolean;
	bubbles: boolean;
	cancelBubble: boolean;
	cancelable: false;
	composed: false;
	currentTarget: false;
	defaultPrevented: false;
	detail: SvelteSelectDetail;
	eventPhase: number;
	path: any[];
	returnValue: boolean;
	srcElement: any;
	target: any;
	timeStamp: number;
	type: string;
}
