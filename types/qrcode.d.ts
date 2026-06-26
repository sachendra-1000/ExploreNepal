declare module "qrcode" {
  export function toDataURL(
    text: string,
    options?: any,
    callback?: (error: Error | null, url: string) => void
  ): Promise<string>;

  export function toCanvas(
    canvas: HTMLCanvasElement,
    text: string,
    options?: any,
    callback?: (error: Error | null) => void
  ): Promise<void>;

  export function toString(
    text: string,
    options?: any,
    callback?: (error: Error | null, string: string) => void
  ): Promise<string>;
}
