/**
 * Mock for `server-only` package in Vitest.
 *
 * The real `server-only` package throws when imported outside a Next.js
 * server component. In Vitest (Node.js test environment), we mock it as
 * a no-op so server modules can be unit-tested without the Next.js runtime.
 *
 * This mock is aliased via vitest.config.ts and is ONLY used in tests.
 * It does NOT affect production builds.
 */
const serverOnlyMock = {};
export default serverOnlyMock;
