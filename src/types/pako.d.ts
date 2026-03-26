declare module "pako" {
  export function deflate(
    data: string | Uint8Array,
    options?: any
  ): Uint8Array;

  export function inflate(
    data: string | Uint8Array,
    options?: { to?: "string" } & Record<string, any>
  ): string | Uint8Array;
}
