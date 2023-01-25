export function onRequestGet({ request }) {
	return Response.json(request.cf);
}
