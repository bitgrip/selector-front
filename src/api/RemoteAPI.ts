// TODO switch to private var, when RemoteAPI is called only server side import { env } from '$env/dynamic/private';
import { env } from '$env/dynamic/public';

const apiRequest = async (method: RequestInit['method'], path: string, payload?: unknown) => {
	const baseUrl = env.PUBLIC_BASE_URL?.replace(/\/+$/, '') || '';
	const url = `${baseUrl}${path}`;
	console.info("RemoteAPI.Request", baseUrl, path, url)
	const response = await fetch(url, {
		method,
		body: payload !== undefined ? JSON.stringify(payload) : undefined,
		headers: payload !== undefined ? { 'Content-Type': 'application/json' } : undefined
	});
	if (response.ok) {
		return await response.json();
	} else {
		throw new Error(response.statusText);
	}
};

const get = (path: string, payload?: unknown) => apiRequest('GET', path, payload);

const deleteRequest = (path: string, payload?: unknown) => apiRequest('DELETE', path, payload);
const post = (path: string, payload?: unknown) => apiRequest('POST', path, payload);
const patch = (path: string, payload?: unknown) => apiRequest('PATCH', path, payload);
const RemoteAPI = {
	get,
	delete: deleteRequest,
	post,
	patch
};
export default RemoteAPI;
