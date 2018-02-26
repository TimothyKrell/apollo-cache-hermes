"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var CacheSnapshot_1 = require("../../../../src/CacheSnapshot");
var CacheContext_1 = require("../../../../src/context/CacheContext");
var operations_1 = require("../../../../src/operations");
var OptimisticUpdateQueue_1 = require("../../../../src/OptimisticUpdateQueue");
var schema_1 = require("../../../../src/schema");
var helpers_1 = require("../../../helpers");
var QueryRootId = schema_1.StaticNodeId.QueryRoot;
function createNewCacheSnapshot(cacheContext) {
    var snapshot = helpers_1.createGraphSnapshot({
        foo: 123,
        bar: 'asdf',
        viewer: {
            id: 'a',
            first: 'Jonh',
            last: 'Doe',
            __typename: 'Viewer',
        },
    }, "{ foo bar viewer { id first last __typename } }", cacheContext);
    return new CacheSnapshot_1.CacheSnapshot(snapshot, snapshot, new OptimisticUpdateQueue_1.OptimisticUpdateQueue());
}
describe("operations.migrate", function () {
    var cacheContext;
    // let cacheSnapshot: CacheSnapshot;
    beforeAll(function () {
        cacheContext = new CacheContext_1.CacheContext(tslib_1.__assign({}, helpers_1.strictConfig, { freeze: false }));
    });
    it("can add fields to root", function () {
        var migrated = operations_1.migrate(createNewCacheSnapshot(cacheContext), (_a = {}, _a['Query'] = {
            extra: function (_previous) { return ''; },
        }, _a));
        var cacheAfter = operations_1.extract(migrated.baseline, cacheContext);
        expect(cacheAfter).to.deep.eq((_b = {},
            _b[QueryRootId] = {
                type: 0 /* EntitySnapshot */,
                data: {
                    foo: 123,
                    bar: 'asdf',
                    extra: '',
                    'viewer': undefined,
                },
                outbound: [{
                        id: 'a', path: ['viewer'],
                    }],
            },
            _b['a'] = {
                type: 0 /* EntitySnapshot */,
                data: {
                    id: 'a',
                    first: 'Jonh',
                    last: 'Doe',
                    __typename: 'Viewer',
                },
                inbound: [{ id: QueryRootId, path: ['viewer'] }],
            },
            _b));
        var _a, _b;
    });
    it("can modify fields to root", function () {
        var migrated = operations_1.migrate(createNewCacheSnapshot(cacheContext), (_a = {}, _a['Query'] = {
            foo: function (_previous) { return 456; },
            bar: function (_previous) { return 'woohoo'; },
        }, _a));
        var cacheAfter = operations_1.extract(migrated.baseline, cacheContext);
        expect(cacheAfter).to.deep.eq((_b = {},
            _b[QueryRootId] = {
                type: 0 /* EntitySnapshot */,
                data: {
                    foo: 456,
                    bar: 'woohoo',
                    'viewer': undefined,
                },
                outbound: [{
                        id: 'a', path: ['viewer'],
                    }],
            },
            _b['a'] = {
                type: 0 /* EntitySnapshot */,
                data: {
                    id: 'a',
                    first: 'Jonh',
                    last: 'Doe',
                    __typename: 'Viewer',
                },
                inbound: [{ id: QueryRootId, path: ['viewer'] }],
            },
            _b));
        var _a, _b;
    });
    it("can add fields to non-root entites", function () {
        var migrated = operations_1.migrate(createNewCacheSnapshot(cacheContext), (_a = {}, _a['Viewer'] = {
            suffix: function (_previous) { return 'Dr'; },
        }, _a));
        var cacheAfter = operations_1.extract(migrated.baseline, cacheContext);
        expect(cacheAfter).to.deep.eq((_b = {},
            _b[QueryRootId] = {
                type: 0 /* EntitySnapshot */,
                data: {
                    foo: 123,
                    bar: 'asdf',
                    'viewer': undefined,
                },
                outbound: [{
                        id: 'a', path: ['viewer'],
                    }],
            },
            _b['a'] = {
                type: 0 /* EntitySnapshot */,
                data: {
                    id: 'a',
                    first: 'Jonh',
                    last: 'Doe',
                    suffix: 'Dr',
                    __typename: 'Viewer',
                },
                inbound: [{ id: QueryRootId, path: ['viewer'] }],
            },
            _b));
        var _a, _b;
    });
    it("can modify fields of non-root entities", function () {
        var migrated = operations_1.migrate(createNewCacheSnapshot(cacheContext), (_a = {}, _a['Viewer'] = {
            first: function (_previous) { return 'Adam'; },
            last: function (_previous) { return 'Smith'; },
        }, _a));
        var cacheAfter = operations_1.extract(migrated.baseline, cacheContext);
        expect(cacheAfter).to.deep.eq((_b = {},
            _b[QueryRootId] = {
                type: 0 /* EntitySnapshot */,
                data: {
                    foo: 123,
                    bar: 'asdf',
                    'viewer': undefined,
                },
                outbound: [{
                        id: 'a', path: ['viewer'],
                    }],
            },
            _b['a'] = {
                type: 0 /* EntitySnapshot */,
                data: {
                    id: 'a',
                    first: 'Adam',
                    last: 'Smith',
                    __typename: 'Viewer',
                },
                inbound: [{ id: QueryRootId, path: ['viewer'] }],
            },
            _b));
        var _a, _b;
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5TWlncmF0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVudGl0eU1pZ3JhdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0RBQThEO0FBQzlELHFFQUFvRTtBQUNwRSx5REFBOEQ7QUFDOUQsK0VBQThFO0FBRTlFLGlEQUFvRTtBQUNwRSw0Q0FBcUU7QUFFN0QsSUFBQSw2Q0FBc0IsQ0FBa0I7QUFFaEQsZ0NBQWdDLFlBQTBCO0lBQ3hELElBQU0sUUFBUSxHQUFHLDZCQUFtQixDQUNsQztRQUNFLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLE1BQU07UUFDWCxNQUFNLEVBQUU7WUFDTixFQUFFLEVBQUUsR0FBRztZQUNQLEtBQUssRUFBRSxNQUFNO1lBQ2IsSUFBSSxFQUFFLEtBQUs7WUFDWCxVQUFVLEVBQUUsUUFBUTtTQUNyQjtLQUNGLEVBQ0QsaURBQWlELEVBQ2pELFlBQVksQ0FDYixDQUFDO0lBQ0YsTUFBTSxDQUFDLElBQUksNkJBQWEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksNkNBQXFCLEVBQUUsQ0FBQyxDQUFDO0FBQzVFLENBQUM7QUFFRCxRQUFRLENBQUMsb0JBQW9CLEVBQUU7SUFDN0IsSUFBSSxZQUEwQixDQUFDO0lBQy9CLG9DQUFvQztJQUNwQyxTQUFTLENBQUM7UUFDUixZQUFZLEdBQUcsSUFBSSwyQkFBWSxzQkFBTSxzQkFBWSxJQUFFLE1BQU0sRUFBRSxLQUFLLElBQUcsQ0FBQztJQUN0RSxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx3QkFBd0IsRUFBRTtRQUMzQixJQUFNLFFBQVEsR0FBRyxvQkFBTyxDQUFDLHNCQUFzQixDQUFDLFlBQVksQ0FBQyxZQUFJLEdBQUMsT0FBTyxJQUFHO1lBQzFFLEtBQUssRUFBRSxVQUFDLFNBQW9CLElBQUssT0FBQSxFQUFFLEVBQUYsQ0FBRTtTQUNwQyxNQUFHLENBQUM7UUFDTCxJQUFNLFVBQVUsR0FBRyxvQkFB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