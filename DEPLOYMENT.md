# Deployment Guide

This document explains how to run the **Ghuman Restaurant** Next.js application behind Nginx with HTTPS certificates issued by Certbot. The stack targets local or self-managed Linux hosts with Docker available.

---

## 1. Prerequisites

- Docker Engine >= 24 and the Docker Compose plugin.
- A Linux host (or WSL2) with ports `80` and `443` open.
- A DNS record pointing your desired domain (e.g. `ghuman-restaurant.local` or a real hostname) to the server IP.
- Ability to run `certbot` and write to `/etc/letsencrypt` (Compose mounts `./certbot/conf` and `./certbot/www`).
- Copy `.env.example` to `.env.production`, then update values:

  ```bash
  cp .env.example .env.production
  # edit .env.production with the final public URL and secrets
  ```

---

## 2. Build and Test Containers

The repository includes a multi-stage `Dockerfile` that produces a production-ready Next.js image.

Build with Compose:

```bash
docker compose build web
```

Or build/run manually:

```bash
docker build -t ghuman-restaurant:latest .
docker run --rm -p 3000:3000 --env-file .env.production ghuman-restaurant:latest
```

---

## 3. Configure Nginx and Certificates

1. Update `deploy/nginx/conf.d/default.conf`:
   - Replace every `ghuman-restaurant.local` with your real domain.
   - Confirm the `ssl_certificate` and `ssl_certificate_key` paths match the certificate names Certbot will create.

2. Issue the first certificate once DNS resolves:

   ```bash
   docker compose up -d nginx
   docker compose run --rm \
     -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
     -v "$(pwd)/certbot/www:/var/www/certbot" \
     certbot/certbot certonly --webroot \
     --webroot-path /var/www/certbot \
     --email you@example.com \
     --agree-tos \
     --no-eff-email \
     -d your-domain.example
   ```

3. Validate the certificate files:

   ```bash
   docker run --rm \
     -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
     certbot/certbot \
     certbot certificates
   ```

4. Reload Nginx to serve HTTPS:

   ```bash
   docker compose restart nginx
   ```

The `certbot` service in `docker-compose.yml` handles automatic renewals every 12 hours by sharing the same certificate volume with Nginx.

---

## 4. Start the Stack

```bash
docker compose up -d
```

Services:

- **web** – Next.js app running `node server.js` on port 3000 (internal).
- **nginx** – Reverse proxy terminating TLS, caching static assets, forwarding WebSockets.
- **certbot** – Optional renewal loop; keep enabled for unattended certificate refresh.

Monitoring commands:

```bash
docker compose ps
docker compose logs -f web
docker compose logs -f nginx
```

Smoke test:

```bash
curl -I https://your-domain.example
```

---

## 5. Maintenance Workflow

1. Deploy updates:
   ```bash
   git pull
   docker compose build web
   docker compose up -d web
   ```
2. Renew manually (if you disable the renewal container):
   ```bash
   docker compose run --rm certbot certbot renew
   docker compose exec nginx nginx -s reload
   ```
3. Back up the `certbot/conf` and `certbot/www` directories.
4. Consider system-level hardening (firewall, fail2ban, unattended upgrades).

---

## 6. Future Extensions

- Add Neo4j and Redis services to `docker-compose.yml` when backend integration begins.
- Push the `web` image to a private registry and reference it via the `image:` field for consistent deployments across environments.
- Integrate log shipping or monitoring (e.g. Promtail, Loki, or a managed service) for long-running installations.

You now have a reproducible baseline deployment that can be promoted before layering additional features.
