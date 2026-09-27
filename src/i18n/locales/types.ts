import type { pt } from "./pt";

type Widen<T> = T extends string ? string : { [K in keyof T]: Widen<T[K]> };
export type Translation = Widen<typeof pt>;
export type Lang = "pt" | "en" | "es" | "fr";
