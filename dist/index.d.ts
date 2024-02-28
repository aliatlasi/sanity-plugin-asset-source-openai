import {Plugin as Plugin_2} from 'sanity'

/**
 * Usage in `sanity.config.ts` (or .js)
 *
 * ```ts
 * import {defineConfig} from 'sanity'
 * import {openaiImageAsset} from 'sanity-plugin-asset-source-openai'
 *
 * export default defineConfig({
 *   // ...
 *   plugins: [openaiImageAsset()],
 * })
 * ```
 */
export declare const openaiImageAsset: Plugin_2<OpenaiImageAssetConfig>

declare interface OpenaiImageAssetConfig {
  API_KEY: string
}

export {}
