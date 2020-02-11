// eslint-disable-next-line
/* global document, window, global */
import test from 'tape-catch';

import {CompositeLayer} from '@deck.gl/core';
import {ScatterplotLayer} from '@deck.gl/layers';

class DemoCompositeLayer extends CompositeLayer {
  renderLayers() {
    return new ScatterplotLayer(this.props);
  }
}

// Mock the loading of the script

test('jupyter-widget: dynamic-registration', t0 => {
  let module;
  try {
    module = require('@deck.gl/jupyter-widget/create-deck');
  } catch (error) {
    t0.comment('dist mode, skipping dynamic registration tests');
    t0.end();
    return;
  }

  t0.test('addResourceToConverter', t => {
    const TEST_LIBRARY_NAME = 'DemoLibrary';
    window[TEST_LIBRARY_NAME] = {DemoCompositeLayer};
    const oldFetch = window.fetch;
    window.fetch = url => {
      return Promise.resolve({
        text: () => ''
      });
    };
    const onComplete = () => {
      const props = module.jsonConverter.convert({
        layers: [{'@@type': 'DemoCompositeLayer', data: []}]
      });
      t.ok(props.layers[0] instanceof DemoCompositeLayer, 'Should add new class to the converter');
      delete window[TEST_LIBRARY_NAME];
      window.fetch = oldFetch;
      t.end();
    };
    module.addResourceToConverter({libraryName: TEST_LIBRARY_NAME, resourceUri: '', onComplete});
  });

  t0.end();
});
