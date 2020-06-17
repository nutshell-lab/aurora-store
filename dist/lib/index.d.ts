declare type Store = {
    db?: Function;
    idField?: string;
    validate?: Function;
    findIn?: Function;
    findAll?: Function;
    find?: Function;
    put?: Function;
    update?: Function;
    create?: Function;
    findOrCreate?: Function;
};
declare const _default: ({ kind, idField, validator }: {
    kind: any;
    idField?: string;
    validator?: () => void;
}) => Promise<Store>;
export default _default;
