interface Connector<T> {
    kind?: string;
    validate?: Function;
    idField?: keyof T;
}
declare const _default: <T>({ kind, validate, idField }: Connector<T>) => () => Promise<Readonly<{
    create: (data: T) => Promise<any>;
    find: (id: T[keyof T]) => Promise<any>;
    findOrCreate: (data: T) => Promise<any>;
    update: (data: T) => Promise<any>;
    updateOrCreate: (data: T) => Promise<any>;
}>>;
export default _default;
