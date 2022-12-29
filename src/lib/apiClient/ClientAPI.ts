const apiRequest = async (method: RequestInit['method'], path: string, payload?: unknown) => {
	const url = `/api${path}`;
	const response = await fetch(url, {
		method,
		body: payload !== undefined ? JSON.stringify(payload) : undefined,
		headers: payload !== undefined ? { 'Content-Type': 'application/json' } : undefined
	});
	console.log('ClientApi', response);
	if (response.ok) {
		try {
			return await response.json();
		} catch (error) {
			console.error(error);
		}
	} else {
		console.error(response.statusText);
	}
};

const get = (path: string, payload?: unknown) => apiRequest('GET', path, payload);
const deleteRequest = (path: string, payload?: unknown) => apiRequest('DELETE', path, payload);
const post = (path: string, payload?: unknown) => apiRequest('POST', path, payload);
const patch = (path: string, payload?: unknown) => apiRequest('PATCH', path, payload);
const ClientAPI = {
	get,
	delete: deleteRequest,
	post,
	patch
};
export default ClientAPI;
