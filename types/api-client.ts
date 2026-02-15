export interface RequestConfig {
  params?: Record<string, unknown>;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface RequestOptions {
  params?: Record<string, unknown>;
  body?: unknown;
  fields?: string[]; // Google-specific: field mask
  headers?: Record<string, string>;
}

export interface EndpointOptions {
  params?: Record<string, unknown>;
  body?: unknown;
  fields?: string[];
  headers?: Record<string, string>;
}

export type ApiMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E; redirect?: string; notFound?: boolean };
