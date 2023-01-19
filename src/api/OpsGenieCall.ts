// TODO switch to private var, when RemoteAPI is called only server side import { env } from '$env/dynamic/private';
import { env } from '$env/dynamic/private';

const opsGenieRequest = async () => {
	const response = await fetch(
		`https://api.opsgenie.com/v2/schedules/${env.PRIVATE_OCD_SCHEDULE_ID}/on-calls`,
		{
			headers: {
				Authorization: `GenieKey ${env.PRIVATE_OCD_API_KEY}`,
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json'
			}
		}
	);
	return await response.json();
};

export default opsGenieRequest;
