# Soni CMS: Engineering Lessons Learned

## Pattern: Scalar Documentation Themes

- **Context**: Using `@scalar/nextjs-api-reference` for API documentation Route Handlers.
- **Problem**:
  1. Attempting to use `'violet'` theme causes a TypeScript literal mismatch.
  2. Attempting to use `spec: { url: '...' }` or nesting under `configuration` causes `Object literal may only specify known properties` errors because `spec` is explicitly omitted from the `ApiReferenceConfigurationWithSource` type in v0.9.18.
- **Solution**: Use the top-level `url` property directly, and sticking to `'purple'` (or other allowed literals).
- **Lesson**: Scalar's Next.js adapter has a custom configuration hybrid that omits standard `spec` nesting in favor of top-level properties for `url` and `content`.
