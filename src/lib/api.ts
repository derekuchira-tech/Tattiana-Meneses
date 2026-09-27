// Browser helper for same-origin calls to the site Function.
export class ApiError extends Error {
  constructor(message: string, readonly code: string, readonly status: number = 0) {
    super(message);
    this.name = "ApiError";
  }
}

export async function requestJson(url: string, init: RequestInit = {}): Promise<unknown> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  let response: Response;
  try {
    response = await fetch(url, { ...init, headers, credentials: "same-origin" });
  } catch (error) {
    if (init.signal?.aborted) throw error;
    throw new ApiError("network", "network_error");
  }
  if (response.status === 401 || response.status === 403) {
    throw new ApiError("access", "access_denied", response.status);
  }
  if (response.redirected || !response.headers.get("content-type")?.includes("application/json")) {
    throw new ApiError("invalid", "invalid_response", response.status);
  }
  let data: unknown;
  try { data = await response.json(); }
  catch { throw new ApiError("invalid", "invalid_response", response.status); }
  const body = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  const code = typeof body?.error === "string" ? body.error
    : (!response.ok || body?.ok === false) && typeof body?.code === "string" ? body.code
    : response.ok ? null : "request_failed";
  if (!response.ok || body?.ok === false || code) {
    throw new ApiError(code ?? "request_failed", code ?? "request_failed", response.status);
  }
  return data;
}

export function isWriteOutcomeUnknown(error: unknown): boolean {
  if (!(error instanceof ApiError) || error.status === 401 || error.status === 403) return false;
  if (error.code === "write_rejected") return false;
  return ["network_error", "invalid_response", "write_result_unknown"].includes(error.code)
    || (error.status >= 500 && error.status < 600);
}
