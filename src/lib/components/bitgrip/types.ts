interface Parent {
	id: string;
	name: string;
	enabled: boolean;
	addedRotations: any;
}

interface OnCallParticipant {
	id: string;
	name: string;
	type: string;
}

interface Data {
	_parent: Parent;
	onCallParticipants: OnCallParticipant[];
}

export interface OpsGenieResponse {
	data: Data;
	took: number;
	requestId: string;
}
