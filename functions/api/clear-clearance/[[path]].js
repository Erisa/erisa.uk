export function onRequestGet(ctx) {
	let url = new URL(ctx.request.url);

	url.pathname = '/' + ctx.params.path;
	url.protocol = 'https:';

	// for now lets just keep this simple
	let domain = url.hostname;
	if (url.hostname.endsWith('.erisa.uk')) {
		domain = 'erisa.uk';
	} else if (url.hostname.endsWith('.erisa.pages.dev')) {
		domain = 'erisa.pages.dev';
	}

	return new Response('', {
		status: 302,
		headers: {
			Location: url.toString(),
			'Set-Cookie': `cf_clearance=invalid; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; path=/; domain=.${domain}`,
		},
	});
}
