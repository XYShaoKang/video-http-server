declare module '@byteinspire/api' {
  import { API, SDK } from '@byteinspire/db'

  export { SDK }
  export const db: API
  export const file: {
    upload(
      name: string,
      file: Buffer | string | { url: string },
      // 传递给 formData 的 options
      options?: {
        type: string
        region: string
        [key: string]: unknown
      },
      // 传递给 formData 的 additions
      addition?: unknown
    ): Promise<unknown>
    readBufferFromUrl(url: string): Promise<Buffer>
  }
}
