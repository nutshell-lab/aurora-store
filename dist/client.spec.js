"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ava_1 = __importDefault(require("ava"));
var client_1 = __importDefault(require("./client"));
ava_1["default"]('A connection can be made to a database', function (t) {
    t.notThrowsAsync(client_1["default"]().then(function (client) { return client(); }));
});
//# sourceMappingURL=client.spec.js.map