import { extract } from '../../../../../src/operations/extract';
import { Serializeable, StaticNodeId } from '../../../../../src/schema';
import { createSnapshot } from '../../../../helpers';

const { QueryRoot: QueryRootId } = StaticNodeId;

describe.skip(`operations.extract`, () => {
  describe(`simple leaf-values hanging off a root`, () => {

    let extractResult: Serializeable.GraphSnapshot;
    beforeAll(() => {
      const snapshot = createSnapshot(
        { foo: 123, bar: 'asdf' },
        `{ foo bar }`
      ).snapshot;

      extractResult = extract(snapshot);
    });

    it(`extracts JSON serializable object`, () => {
      expect(extractResult).to.deep.eq({
        [QueryRootId]: {
          type: Serializeable.NodeSnapshotType.EntitySnapshot,
          data: { foo: 123, bar: 'asdf' },
        },
      });
    });

  });
});