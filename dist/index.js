"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ramda_1 = require("ramda");
var ferrors_1 = require("@nutshelllab/ferrors");
var client_1 = __importDefault(require("./client"));
var printList = function (list) {
    if (list === void 0) { list = []; }
    return list.join(' ');
};
var throwBadArgument = function (args) {
    return ferrors_1.throwError('INVALID_ARGUMENT', "function was badly called with arguments " + printList(args));
};
exports["default"] = (function (_a) {
    var kind = _a.kind, _b = _a.idField, idField = _b === void 0 ? 'id' : _b, _c = _a.validate, validate = _c === void 0 ? function (data) { return data; } : _c;
    var store = {
        tableName: kind,
        idField: idField,
        validate: validate
    };
    store.findIn = function (field, values) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (ramda_1.isEmpty(field) || ramda_1.isEmpty(values))
                throwBadArgument([field, values]);
            return [2, client_1["default"]().then(function (db) { return db(store.tableName).whereIn(field, values); })];
        });
    }); };
    store.findAll = function (filters) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, client_1["default"]().then(function (db) { return db(store.tableName).where(filters); })];
            });
        });
    };
    store.find = function (filters) { return __awaiter(void 0, void 0, void 0, function () {
        var existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, client_1["default"]().then(function (db) { return db(store.tableName)
                        .where(filters)
                        .returning('*')
                        .first(); })];
                case 1:
                    existing = _a.sent();
                    return [2, existing
                            ? store.validate(existing)
                            : throwBadArgument(filters)];
            }
        });
    }); };
    store.put = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var result, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (ramda_1.isEmpty(data))
                        throwBadArgument(data);
                    return [4, store.update(data)];
                case 1:
                    _a = (_b.sent());
                    if (_a) return [3, 3];
                    return [4, store.create(data)];
                case 2:
                    _a = (_b.sent());
                    _b.label = 3;
                case 3:
                    result = _a;
                    return [2, store.validate(result)];
            }
        });
    }); };
    store.update = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (ramda_1.isEmpty(data))
                throwBadArgument(data);
            return [2, client_1["default"]().then(function (db) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2, db(store.tableName)
                                .where(store.idField, data[store.idField])
                                .update(store.validate(data), '*')
                                .then(function (x) { return (Array.isArray(x) ? x[0] : null); })];
                    });
                }); })];
        });
    }); };
    store.create = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (ramda_1.isEmpty(data))
                throwBadArgument(data);
            return [2, client_1["default"]().then(function (db) { return db(store.tableName)
                    .insert(store.validate(data))
                    .returning('*')
                    .then(function (x) { return (Array.isArray(x) ? x[0] : null); }); })];
        });
    }); };
    store.findOrCreate = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var id, existing, entity, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = data[store.idField] || throwBadArgument(data);
                    return [4, store.find({ idField: id })];
                case 1:
                    existing = _b.sent();
                    _a = existing;
                    if (_a) return [3, 3];
                    return [4, store.create(data)];
                case 2:
                    _a = (_b.sent());
                    _b.label = 3;
                case 3:
                    entity = _a;
                    return [2, store.validate(entity)];
            }
        });
    }); };
    store.remove = function (filters) { return __awaiter(void 0, void 0, void 0, function () {
        var existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, store.find(filters)];
                case 1:
                    existing = _a.sent();
                    return [2, existing
                            ? client_1["default"]().then(function (db) { return db(store.tableName).where(filters)["delete"](); })
                            : store.validate(existing)];
            }
        });
    }); };
    store.truncate = function (_a) {
        var _b = _a.force, force = _b === void 0 ? false : _b;
        return __awaiter(void 0, void 0, void 0, function () {
            var notEmpty;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, store.findAll()];
                    case 1:
                        notEmpty = (_c.sent()).length > 0;
                        if (notEmpty && !force)
                            ferrors_1.throwError('OPERATION_REJECTED', "Cannot truncate table " + store.tableName + " without force mode. Override with { force: true } param.");
                        return [2, client_1["default"]().then(function (db) { return db(store.tableName).truncate(); })];
                }
            });
        });
    };
    store.knexClient = client_1["default"];
    return store;
});
//# sourceMappingURL=index.js.map