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
exports["default"] = (function (_a) {
    var kind = _a.kind, validate = _a.validate, idField = _a.idField;
    return function () { return __awaiter(void 0, void 0, void 0, function () {
        var client, store;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, client_1["default"]()["catch"](ferrors_1.reThrow('DB_CONNECTION_ERROR'))];
                case 1:
                    client = _a.sent();
                    store = {
                        create: function (data) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (ramda_1.isEmpty(data))
                                    ferrors_1.throwError('INVALID_ARGUMENT', 'Cannot create, provided data is empty');
                                return [2, client(kind)
                                        .insert(validate(data))
                                        .returning('*')
                                        .then(function (x) { return (Array.isArray(x) ? x[0] : null); })];
                            });
                        }); },
                        find: function (id) { return __awaiter(void 0, void 0, void 0, function () {
                            var existing;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, client(kind)
                                            .returning('*')
                                            .first()];
                                    case 1:
                                        existing = _a.sent();
                                        return [2, existing
                                                ? validate(existing)
                                                : ferrors_1.throwError('ORG_NOT_FOUND', "could not found entity " + id + " in " + kind)];
                                }
                            });
                        }); },
                        findOrCreate: function (data) { return __awaiter(void 0, void 0, void 0, function () {
                            var id, existing, entity, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        id = data[idField] ||
                                            ferrors_1.throwError('INVALID_ARGUMENT', "Cannot find or create entity : entity has no " + idField + " field, try pass optional idField parameter.");
                                        return [4, store.find(id)];
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
                                        return [2, validate(entity)];
                                }
                            });
                        }); },
                        update: function (data) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (ramda_1.isEmpty(data))
                                    ferrors_1.throwError('INVALID_ARGUMENT', 'Cannot update, provided data is empty');
                                return [2, client(kind)
                                        .where(idField, data[idField])
                                        .update(validate(data), '*')
                                        .then(function (x) { return (Array.isArray(x) ? x[0] : null); })];
                            });
                        }); },
                        updateOrCreate: function (data) { return __awaiter(void 0, void 0, void 0, function () {
                            var result, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (ramda_1.isEmpty(data))
                                            ferrors_1.throwError('INVALID_ARGUMENT', 'Cannot updateOrCreate, provided data is empty');
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
                                        console.log('result is', result);
                                        return [2, validate(result)];
                                }
                            });
                        }); }
                    };
                    return [2, Object.freeze(store)];
            }
        });
    }); };
});
//# sourceMappingURL=index.js.map