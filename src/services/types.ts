export type CrudService<T> = {
  list: (token: string, onAuthError?: () => void) => Promise<T[]>;
  create: (data: Partial<T>, token: string, onAuthError?: () => void) => Promise<T>;
  update: (id: string, data: Partial<T>, token: string, onAuthError?: () => void) => Promise<T>;
  delete: (id: string, token: string, onAuthError?: () => void) => Promise<void>;
};
