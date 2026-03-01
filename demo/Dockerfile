# Global ARGs (available to all stages)
ARG DOCKER_VERSION=27.3.1
ARG BASE_IMAGE=ubuntu:24.04
ARG APP_VERSION=1.0.0

# Multi-stage build: builder stage
FROM node:${DOCKER_VERSION}-alpine AS builder

# ARG scoping: stage-local (shadows global)
ARG NODE_VERSION=20
ARG NPM_VERSION=10

# LABELs (metadata)
LABEL maintainer="dev@example.com" \
      version="${APP_VERSION}" \
      description="Theme fixture Dockerfile" \
      org.opencontainers.image.source="https://github.com/example/theme"

# ENV (persistent environment variables)
ENV APP_HOME=/app \
    NODE_ENV=production

# EXPOSE ports
EXPOSE 8080 8443

# WORKDIR (creates if missing, absolute/relative)
WORKDIR ${APP_HOME}
WORKDIR sub/dir

# USER/GROUP (numeric or name)
USER node:nogroup
USER 1000:1000

# SHELL override (exec/shell form)
SHELL ["/bin/sh", "-c"]  # Alpine default

# COPY (local files/directories, preserves metadata)
COPY package*.json ./
COPY src/ ./src/
COPY --chown=node:node app/ ./app/
COPY --from=builder --chown=1000:1000 /app/node_modules ./node_modules

# ADD (COPY + tar/URL auto-extract)
ADD https://example.com/config.tar.gz /etc/
ADD package.tar.xz /opt/

# RUN (shell/exec forms, --mount for BuildKit)
RUN npm ci --only=production && npm cache clean --force
RUN --mount=type=bind,source=local-src,target=/app-src \
    --mount=type=cache,target=/npm-cache \
    npm install

# Multi-line RUN (backslashes, heredocs)
RUN apt-get update && \
    apt-get install -y curl wget && \
    rm -rf /var/lib/apt/lists/*

# Heredoc RUN (Docker 24.04+)
RUN <<EOF
apt-get update
apt-get install -y python3
echo "Multi-line heredoc"
EOF

# HEALTHCHECK (CMD/interval/timeout/retries/disable/start-period)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8080}/health || exit 1

HEALTHCHECK NONE  # Disable

# Multi-stage: runtime stage
FROM ${BASE_IMAGE}

# ARG after FROM (stage scope only)
ARG APP_PORT=8080

# VOLUME (anonymous/named)
VOLUME ["/data", "/logs"]
VOLUME [ "/app/data" ]

# STOPSIGNAL
STOPSIGNAL SIGTERM
STOPSIGNAL SIGQUIT

# ENTRYPOINT (exec/shell/exec_json/shell_json)
ENTRYPOINT ["nginx"]
ENTRYPOINT ["nginx", "-g", "daemon off;"]
ENTRYPOINT nginx -g "daemon off;"

# CMD (overrides ENTRYPOINT args, exec/shell/exec_json/shell_json)
CMD ["-D"]
CMD ["/bin/bash"]
CMD exec /app/start.sh
CMD exec top -b

# Multi-stage: final stage with ONBUILD triggers
FROM alpine:3.20 AS final

# ONBUILD (triggers when used as base)
ONBUILD ARG ONBUILD_VERSION
ONBUILD ENV APP_VERSION=$ONBUILD_VERSION
ONBUILD COPY onbuild-app/ /app/
ONBUILD RUN echo "ONBUILD triggered"

# Multi-stage: base for others
FROM golang:1.23-alpine AS golang-base
ONBUILD WORKDIR /go/src/app
ONBUILD COPY . .

# USERNAME (deprecated, but test)
MAINTAINER "Deprecated USERNAME"  # Legacy

# Syntax escaping (JSON/shell)
# escape=`
RUN echo "JSON \t tab \n newline"

# Escaped Dockerfile continuation
RUN apt-get update && \
    apt-get install -y \
    curl \
    && rm \
    -rf \
    /var/lib/apt/lists/*

# BuildKit frontend syntax
# syntax=docker/dockerfile:experimental
RUN --mount=type=secret,id=mysecret,dst=/secret cat /secret

# Frontend variants
# syntax=docker/dockerfile:1.4-labs
RUN --output /output,type=local,dest=./out $PWD

# heredoc with LABEL
LABEL multi-line="This LABEL spans \
multiple lines" \
      another="value"

# ARG with default/no-value
ARG GIT_REVISION
ARG HTTP_PROXY=http://proxy:8080
ARG HTTPS_PROXY=https://proxy:8443

# Multi FROM with global ARG reuse
FROM python:3.12-slim AS python-runtime
ARG PY_VERSION=3.12
RUN pip install --no-cache-dir flask==${PY_VERSION}

FROM ${BASE_IMAGE} AS test-env
COPY --from=builder /app/tests/ ./tests/
HEALTHCHECK --test="wget --no-verbose --tries=1 --spider http://localhost/health || exit 1"

# Final image
FROM nginx:${DOCKER_VERSION}-alpine

# All instructions in final stage
COPY --from=builder /app/dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
COPY entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh \
 && ln -sf /dev/stdout /var/log/nginx/access.log \
 && ln -sf /dev/stderr /var/log/nginx/error.log

USER nginx
WORKDIR /var/cache/nginx
VOLUME ["/var/cache/nginx/client_temp"]

EXPOSE ${APP_PORT:-8080}/tcp ${APP_PORT:-8080}/udp
ENV NGINX_VERSION=1.27.1

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

# Comments throughout
# End of comprehensive Dockerfile fixture
