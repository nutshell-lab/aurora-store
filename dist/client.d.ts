import Knex from 'knex';
export declare const migrate: () => Promise<void>;
declare const _default: (options?: Knex.Config) => Promise<Knex<any, unknown[]>>;
export default _default;
