function getBaseDomain(url: URL): string {
  const hostname = url.hostname;
  const parts = hostname.split(".");
  if (hostname === "localhost" || hostname.endsWith(".localhost")) {
    return hostname;
  }
  if (parts.length <= 2) {
    return hostname;
  }
  return parts.slice(-2).join(".");
}

export function requireSameOrigin(
  request: Request,
): { ok: true } | { ok: false; message: string } {
  const target = new URL(request.url);
  const targetOrigin = target.origin;
  const targetBase = getBaseDomain(target);
  const originHeader = request.headers.get("origin");
  const refererHeader = request.headers.get("referer");

  const validate = (raw: string) => {
    const candidate = new URL(raw);
    if (candidate.origin === targetOrigin) return true;
    return getBaseDomain(candidate) === targetBase;
  };

  if (originHeader) {
    if (!validate(originHeader)) {
      return { ok: false, message: "Cross-origin requests are not allowed." };
    }
    return { ok: true };
  }

  if (refererHeader) {
    try {
      if (!validate(refererHeader)) {
        return { ok: false, message: "Cross-site requests are not allowed." };
      }
      return { ok: true };
    } catch {
      return { ok: false, message: "Invalid referrer." };
    }
  }

  // If no origin or referer is provided, treat as same-site to avoid blocking valid requests
  return { ok: true };
}
