// Type helper to allow for union types without removing the intellisense from more specific definitions
// See: https://github.com/microsoft/TypeScript/issues/29729
export type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);

// https://bobbyhadz.com/blog/typescript-make-single-property-optional
export type MakeOptional<Type, Key extends keyof Type> = Omit<Type, Key> & Partial<Pick<Type, Key>>;

// https://stackoverflow.com/a/69328045
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }