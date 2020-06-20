import Knex from 'knex';
interface Connector<T> {
    kind?: string;
    validate?: (data: any) => any;
    idField?: keyof T | 'id';
}
declare type Store<T> = {
    db?: Function;
    idField?: keyof T;
    tableName?: string;
    validate?: (data: any) => any;
    findIn?: (field: keyof T, values: any) => Promise<T[]>;
    findAll?: (filters?: object) => Promise<T[]>;
    find?: (filters: object) => Promise<T>;
    put?: (obj: T) => Promise<T>;
    update?: (obj: T) => Promise<T>;
    create?: (obj: T) => Promise<T>;
    findOrCreate?: (obj: T) => Promise<T>;
    remove?: (filters: object) => Promise<T>;
    truncate?: ({ force: boolean }: {
        force: any;
    }) => Promise<void>;
    knexClient?: () => Promise<Knex>;
};
declare const _default: <T>({ kind, idField, validate }: Connector<T>) => Store<T>;
export default _default;
