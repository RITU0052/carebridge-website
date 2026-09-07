/**
 * Safe fetch helper that validates JSON content-type before parsing
 * to prevent SyntaxError ("Unexpected token '<' ... is not valid JSON").
 */
export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<{ ok: boolean; status: number; data: T | null; error?: string }> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const data = (await res.json()) as T;
      return {
        ok: res.ok,
        status: res.status,
        data,
        error: !res.ok ? (data as any)?.error || `Request failed with status ${res.status}` : undefined,
      };
    }

    return {
      ok: false,
      status: res.status,
      data: null,
      error: `Server returned non-JSON response (HTTP ${res.status}).`,
    };
  } catch (err: any) {
    console.error(`Fetch error for ${url}:`, err);
    return {
      ok: false,
      status: 500,
      data: null,
      error: err.message || 'Network error occurred.',
    };
  }
}
