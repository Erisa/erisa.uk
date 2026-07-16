FROM --platform=${BUILDPLATFORM} denoland/deno:2.8.3 AS site-build

WORKDIR /app
COPY deno.json deno.lock ./
RUN deno install

COPY . .

RUN deno task build

FROM --platform=${BUILDPLATFORM} caddy:2.11.4-builder-alpine AS caddy-builder

ARG TARGETOS
ARG TARGETARCH
ARG TARGETVARIANT

RUN GOOS=${TARGETOS} GOARCH=${TARGETARCH} GOARM=${TARGETVARIANT#v} \
    xcaddy build --with github.com/tbshfr/caddy-static-adapter@d5685623f6b59804a79ae8ae173b3bfc1af84ea5

FROM caddy:2.11.4-alpine
LABEL com.centurylinklabs.watchtower.enable=true
COPY --from=caddy-builder /usr/bin/caddy /usr/bin/caddy
COPY --from=site-build /app/dist /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile