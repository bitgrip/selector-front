/** @type {import('@sveltejs/kit').Handle} */

export async function handle({
	event,
	resolve
}: Parameters<Handle>[0]): Promise<ReturnType<Handle>> {
	const url = new URL(event.request.url);
	console.log("hiiiii")
	console.log(import.meta.env.VITE_ADMIN_LOGIN);

	if (url.pathname.startsWith('/')) {
		const auth = event.request.headers.get('Authorization');
		if (auth !== `Basic ${btoa(import.meta.env.VITE_ADMIN_LOGIN)}`) {
			return new Response('Not authorized', {
				status: 401,
				headers: {
					'WWW-Authenticate': 'Basic realm="User Visible Realm", charset="UTF-8"'
				}
			});
		}
	}

	return resolve(event);
}
