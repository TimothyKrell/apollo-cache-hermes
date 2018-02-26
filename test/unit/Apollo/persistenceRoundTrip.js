"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var graphql_tag_1 = require("graphql-tag");
var Hermes_1 = require("../../../src/apollo/Hermes");
var schema_1 = require("../../../src/schema");
var helpers_1 = require("../../helpers");
var baseResourcesV1 = "query baseResournces {\n  viewer {\n    id\n    name\n  }\n}";
var baseResourcesV2 = "query baseResournces {\n  viewer {\n    id\n    name\n    age\n  }\n}";
describe("extract/restore roundtrip", function () {
    var persisted;
    beforeAll(function () {
        var hermes = new Hermes_1.Hermes(tslib_1.__assign({}, helpers_1.strictConfig, { addTypename: true }));
        hermes.write({
            query: graphql_tag_1.default("\n        query getViewer {\n          viewer {\n            id\n            name\n          }\n          history {\n            id\n            incident\n          }\n        }\n      "),
            result: {
                viewer: {
                    id: 0,
                    name: 'Gouda',
                    __typename: 'Viewer',
                },
                history: [{
                        id: 'a',
                        incident: 'power outage',
                        __typename: 'HistoryEntry',
                    }, {
                        id: 'b',
                        incident: 'fire',
                        __typename: 'HistoryEntry',
                    }],
            },
            dataId: schema_1.StaticNodeId.QueryRoot,
        });
        persisted = JSON.stringify(hermes.extract(false, { query: graphql_tag_1.default(baseResourcesV1), optimistic: false }));
    });
    it("throws if schema changed but no migration map is provided on restore", function () {
        var hermes = new Hermes_1.Hermes(tslib_1.__assign({}, helpers_1.strictConfig, { addTypename: true }));
        expect(function () {
            hermes.restore(JSON.parse(persisted), undefined, {
                query: graphql_tag_1.default(baseResourcesV2),
                optimistic: false,
            });
        }).to.throw();
    });
    it("extracted data is pruned according to the prune query", function () {
        var hermes = new Hermes_1.Hermes(tslib_1.__assign({}, helpers_1.strictConfig, { addTypename: true }));
        expect(function () {
            hermes.restore(JSON.parse(persisted), (_a = {},
                _a['Viewer'] = (_b = {},
                    _b['age'] = function (_previous) { return ''; },
                    _b),
                _a), {
                query: graphql_tag_1.default(baseResourcesV2),
                optimistic: false,
            });
            var _a, _b;
        }).to.not.throw();
        expect(function () {
            hermes.readQuery({
                query: graphql_tag_1.default("\n          query getViewer {\n            history {\n              id\n              incident\n            }\n          }\n        "),
            });
        }).to.throw(/read not satisfied by the cache/i);
    });
    it("restored data is migrated and can satified query for v2 base resources", function () {
        var hermes = new Hermes_1.Hermes(tslib_1.__assign({}, helpers_1.strictConfig, { addTypename: true }));
        expect(function () {
            hermes.restore(JSON.parse(persisted), (_a = {},
                _a['Viewer'] = (_b = {},
                    _b['age'] = function (_previous) { return ''; },
                    _b),
                _a), {
                query: graphql_tag_1.default(baseResourcesV2),
                optimistic: false,
            });
            var _a, _b;
        }).to.not.throw();
        expect(hermes.readQuery({
            query: graphql_tag_1.default(baseResourcesV2),
        })).to.deep.eq({
            viewer: {
                id: 0,
                age: '',
                name: 'Gouda',
                __typename: 'Viewer',
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyc2lzdGVuY2VSb3VuZFRyaXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwZXJzaXN0ZW5jZVJvdW5kVHJpcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBOEI7QUFFOUIscURBQXFEO0FBQ3JELDhDQUFtRDtBQUNuRCx5Q0FBNkM7QUFFN0MsSUFBTSxlQUFlLEdBQUcsOERBS3RCLENBQUM7QUFFSCxJQUFNLGVBQWUsR0FBRyx1RUFNdEIsQ0FBQztBQUVILFFBQVEsQ0FBQywyQkFBMkIsRUFBRTtJQUVwQyxJQUFJLFNBQWlCLENBQUM7SUFDdEIsU0FBUyxDQUFDO1FBQ1IsSUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFNLHNCQUNwQixzQkFBWSxJQUNmLFdBQVcsRUFBRSxJQUFJLElBQ2pCLENBQUM7UUFDSCxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ1gsS0FBSyxFQUFFLHFCQUFHLENBQUMsMkxBV1YsQ0FBQztZQUNGLE1BQU0sRUFBRTtnQkFDTixNQUFNLEVBQUU7b0JBQ04sRUFBRSxFQUFFLENBQUM7b0JBQ0wsSUFBSSxFQUFFLE9BQU87b0JBQ2IsVUFBVSxFQUFFLFFBQVE7aUJBQ3JCO2dCQUNELE9BQU8sRUFBRSxDQUFDO3dCQUNSLEVBQUUsRUFBRSxHQUFHO3dCQUNQLFFBQVEsRUFBRSxjQUFjO3dCQUN4QixVQUFVLEVBQUUsY0FBYztxQkFDM0IsRUFBRTt3QkFDRCxFQUFFLEVBQUUsR0FBRzt3QkFDUCxRQUFRLEVBQUUsTUFBTTt3QkFDaEIsVUFBVSxFQUFFLGNBQWM7cUJBQzNCLENBQUM7YUFDSDtZQUNELE1BQU0sRUFBRSxxQkFBWSxDQUFDLFNBQVM7U0FDL0IsQ0FBQyxDQUFDO1FBRUgsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUscUJBQUcsQ0FBQyxlQUFlLENBQUMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMs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