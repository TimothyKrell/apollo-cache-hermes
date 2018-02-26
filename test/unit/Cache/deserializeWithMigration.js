"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Cache_1 = require("../../../src/Cache");
var helpers_1 = require("../../helpers");
describe("deserialization with migration", function () {
    var v1Query = helpers_1.query("query v1($id: ID!) {\n    one {\n      two {\n        three(id: $id, withExtra: true) {\n          id\n          name\n          extraValue\n          __typename\n        }\n      }\n    }\n  }", { id: 0 });
    var v2Query = helpers_1.query("query v1($id: ID!) {\n    one {\n      two {\n        three(id: $id, withExtra: true) {\n          id\n          name\n          extraValue\n          isNew\n          __typename\n        }\n      }\n    }\n  }", { id: 0 });
    var storedV1ExtractResult, expectedV2Cache;
    beforeEach(function () {
        var cache = new Cache_1.Cache(helpers_1.strictConfig);
        cache.write(v1Query, {
            one: {
                two: [
                    {
                        three: {
                            id: '30',
                            name: 'Three0',
                            extraValue: '30-42',
                            __typename: 'THREE',
                        },
                    },
                    {
                        three: {
                            id: '31',
                            name: 'Three1',
                            extraValue: '31-42',
                            __typename: 'THREE',
                        },
                    },
                    null,
                ],
            },
        });
        var extractResult = cache.extract(/* optimistic */ false);
        storedV1ExtractResult = JSON.stringify(extractResult);
        // build the expected v2 cache, where 'three' gains a new 'isNew' field
        // that defaults to 'false'
        expectedV2Cache = new Cache_1.Cache(helpers_1.strictConfig);
        expectedV2Cache.write(v2Query, {
            one: {
                two: [
                    {
                        three: {
                            id: '30',
                            name: 'Three0',
                            extraValue: '30-42',
                            isNew: false,
                            __typename: 'THREE',
                        },
                    },
                    {
                        three: {
                            id: '31',
                            name: 'Three1',
                            extraValue: '31-42',
                            isNew: false,
                            __typename: 'THREE',
                        },
                    },
                    null,
                ],
            },
        });
    });
    it("migrates the restored cache to v2", function () {
        var newCache = new Cache_1.Cache();
        // set up v1 -> v2 migration map that adds the 'isNew' field to 'THREE'
        newCache.restore(JSON.parse(storedV1ExtractResult), (_a = {},
            _a['THREE'] = {
                isNew: function (_previous) { return false; },
            },
            _a));
        expect(newCache.getSnapshot()).to.deep.eq(expectedV2Cache.getSnapshot());
        var _a;
    });
    it("throws if verifyQuery couldn't be satified due to missing migration map", function () {
        var newCache = new Cache_1.Cache();
        expect(function () {
            newCache.restore(JSON.parse(storedV1ExtractResult), undefined, v2Query);
        }).to.throw();
    });
    it("throws if verifyQuery couldn't be satified due to inadequate migration map", function () {
        var newCache = new Cache_1.Cache();
        expect(function () {
            newCache.restore(JSON.parse(storedV1ExtractResult), (_a = {},
                _a['THREE'] = {
                    otherStuff: function (_previous) { return false; },
                },
                _a), v2Query);
            var _a;
        }).to.throw();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVzZXJpYWxpemVXaXRoTWlncmF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGVzZXJpYWxpemVXaXRoTWlncmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNENBQTJDO0FBRTNDLHlDQUFvRDtBQUVwRCxRQUFRLENBQUMsZ0NBQWdDLEVBQUU7SUFFekMsSUFBTSxPQUFPLEdBQUksZUFBSyxDQUFDLG1NQVdyQixFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFZixJQUFNLE9BQU8sR0FBSSxlQUFLLENBQUMsb05BWXJCLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUVmLElBQUkscUJBQTZCLEVBQUUsZUFBc0IsQ0FBQztJQUMxRCxVQUFVLENBQUM7UUFDVCxJQUFNLEtBQUssR0FBRyxJQUFJLGFBQUssQ0FBQyxzQkFBWSxDQUFDLENBQUM7UUFDdEMsS0FBSyxDQUFDLEtBQUssQ0FDVCxPQUFPLEVBQ1A7WUFDRSxHQUFHLEVBQUU7Z0JBQ0gsR0FBRyxFQUFFO29CQUNIO3dCQUNFLEtBQUssRUFBRTs0QkFDTCxFQUFFLEVBQUUsSUFBSTs0QkFDUixJQUFJLEVBQUUsUUFBUTs0QkFDZCxVQUFVLEVBQUUsT0FBTzs0QkFDbkIsVUFBVSxFQUFFLE9BQU87eUJBQ3BCO3FCQUNGO29CQUNEO3dCQUNFLEtBQUssRUFBRTs0QkFDTCxFQUFFLEVBQUUsSUFBSTs0QkFDUixJQUFJLEVBQUUsUUFBUTs0QkFDZCxVQUFVLEVBQUUsT0FBTzs0QkFDbkIsVUFBVSxFQUFFLE9BQU87eUJBQ3BCO3FCQUNGO29CQUNELElBQUk7aUJBQ0w7YUFDRjtTQUNGLENBQ0YsQ0FBQztRQUNGLElBQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUQscUJBQXFCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUV0RCx1RUFBdUU7UUFDdkUsMkJBQTJCO1FBQzNCLGVBQWUsR0FBRyxJQUFJLGFBQUssQ0FBQyxzQkFBWSxDQUFDLENBQUM7UUFDMUMsZUFBZSxDQUFDLEtBQUssQ0FDbkIsT0FBTyxFQUNQO1lBQ0UsR0FBRyxFQUFFO2dCQUNILEdBQUcsRUFBRTtvQkFDSDt3QkFDRSxLQUFLLEVBQUU7NEJBQ0wsRUFBRSxFQUFFLElBQUk7NEJBQ1IsSUFBSSxFQUFFLFFBQVE7NEJBQ2QsVUFBVSxFQUFFLE9BQU87NEJBQ25CLEtBQUssRUFBRSxLQUFLOzRCQUNaLFVBQVUsRUFBRSxPQUFPO3lCQUNwQjtxQkFDRjtvQkFDRDt3QkFDRSxLQUFLLEVBQUU7NEJBQ0wsRUFBRSxFQUFFLElBQUk7NEJBQ1IsSUFBSSxFQUFFLFFBQVE7NEJBQ2QsVUFBVSxFQUFFLE9BQU87NEJBQ25CLEtBQUssRUFBRSxLQUFLOzRCQUNaLFVBQVUsRUFBRSxPQUFPO3lCQUNwQjtxQkFDRjtvQkFDRCxJQUFJO2lCQUNMO2FBQ0Y7U0FDRixDQUNGLENBQUM7SUFFSixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRTtRQUN0QyxJQUFNLFFBQVEsR0FBRyxJQUFJLGFBQUssRUFBRSxDQUFDO1FBQzdCLHVFQUF1RTtRQUN2RSxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUM7WUFDaEQsR0FBQyxPQUFPLElBQUc7Z0JBQ1QsS0FBSyxFQUFFLFVBQUMsU0FBb0IsSUFBSyxPQUFBLEtBQUssRUFBTCxDQUFLO2FBQ3ZDO2dCQUNELENBQUM7UUFDSCxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7O0lBQzNFLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHlFQUF5RSxFQUFFO1FBQzVFLElBQU0sUUFBUSxHQUFHLElBQUksYUFBSyxFQUFFLENBQUM7UUFDN0IsTUFBTSxDQUFDO1lBQ0wsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNoQixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw0RUFBNEUsRUFBRTtRQUMvRSxJQUFNLFFBQVEsR0FBRyxJQUFJLGFBQUssRUFBRSxDQUFDO1FBQzdCLE1BQU0sQ0FBQztZQUNMLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQztnQkFDaEQsR0FBQyxPQUFPLElBQUc7b0JBQ1QsVUFBVSxFQUFFLFVBQUMsU0FBb0IsSUFBSyxPQUFBLEtBQUssRUFBTCxDQUFLO2lCQUM1QztxQkFDQSxPQUFPLENBQUMsQ0FBQzs7UUFDZCxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDaEIsQ0FBQyxDQUFDLENBQUM7QUFFTCxDQUFDLENBQUMsQ0FBQyJ9