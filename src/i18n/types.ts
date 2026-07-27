export type TranslationSchema<T> = T extends string
  ? string
  : T extends readonly unknown[]
    ? { readonly [K in keyof T]: TranslationSchema<T[K]> }
    : T extends object
      ? { readonly [K in keyof T]: TranslationSchema<T[K]> }
      : never;
