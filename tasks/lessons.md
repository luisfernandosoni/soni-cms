# Soni CMS: Engineering Lessons Learned

## Pattern: Scalar Documentation Themes

- **Context**: Using `@scalar/nextjs-api-reference` for API documentation Route Handlers.
- **Problem**:
  1. Attempting to use `'violet'` theme causes a TypeScript literal mismatch.
  2. Attempting to use `spec: { url: '...' }` or nesting under `configuration` causes `Object literal may only specify known properties` errors because `spec` is explicitly omitted from the `ApiReferenceConfigurationWithSource` type in v0.9.18.
- **Solution**: Use the top-level `url` property directly, and sticking to `'purple'` (or other allowed literals).
- **Lesson**: Scalar's Next.js adapter has a custom configuration hybrid that omits standard `spec` nesting in favor of top-level properties for `url` and `content`.

## Pattern: OpenNext & Cloudflare Edge Context

- **Context**: OpenNext polyfills `process`, confusing standard "Node vs Edge" detection.
- **Problem**: `typeof process !== 'undefined'` is true in Edge, leading code to try importing `wrangler` (Node-only), causing 500 crashes.
- **Solution**: Use `process.env.NEXT_RUNTIME === 'edge'` or check for `self.caches` to strictly identify Edge. Wrap `import('wrangler')` in try/catch.
