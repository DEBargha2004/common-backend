export type UpdateProps<T extends {}, Q extends keyof T> = Partial<Omit<T, Q>>;
