export function onRequestGet(ctx) {
  return Response.json(ctx.request.cf)
}
