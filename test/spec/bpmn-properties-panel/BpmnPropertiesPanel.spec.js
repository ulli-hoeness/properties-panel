import {
  render
} from '@testing-library/preact/pure';

import TestContainer from 'mocha-test-container-support';

import {
  query as domQuery,
  queryAll as domQueryAll
} from 'min-dom';

import {
  Injector as injectorMock,
  EventBus as eventBusMock,
  getProviders as getProvidersMock
} from './mocks';

import {
  insertCoreStyles
} from 'test/TestHelper';

import BpmnPropertiesPanel from 'src/bpmn-properties-panel/BpmnPropertiesPanel';

insertCoreStyles();

const noop = () => {};

const noopElement = {
  id: 'foo',
  type: 'foo:bar',
  businessObject: {
    get: noop
  }
};


describe('<BpmnPropertiesPanel>', function() {

  let container,
      parent;

  beforeEach(function() {
    parent = TestContainer.get(this);

    container = document.createElement('div');

    container.classList.add('properties-container');

    container.style.position = 'absolute';
    container.style.right = '0';

    parent.appendChild(container);
  });


  it('should render', function() {

    // given
    const result = createBpmnPropertiesPanel({ container });

    // then
    expect(domQuery('.bio-properties-panel', result.container)).to.exist;
  });


  it('should render provided groups', function() {

    // given
    const groups1 = [
      {
        id: 'group-1',
        label: 'Group 1',
        entries: []
      },
      {
        id: 'group-2',
        label: 'Group 2',
        entries: []
      },
      {
        id: 'group-3',
        label: 'Group 3',
        entries: []
      }
    ];

    const groups2 = [
      {
        id: 'group-4',
        label: 'Group 4',
        entries: []
      }
    ];

    const getProviders = () => {
      return [
        {
          getGroups: () => (groups) => groups.concat(groups1)
        },
        {
          getGroups: () => (groups) => groups.concat(groups2)
        }
      ];
    };

    // when
    const result = createBpmnPropertiesPanel({ container, getProviders });

    // then
    expect(domQueryAll('.bio-properties-panel-group', result.container)).to.have.length(4);
  });


  describe('event emitting', function() {

    it('should update when root element was added', function() {

      // given
      const updateSpy = sinon.spy();

      const eventBus = new eventBusMock();

      eventBus.on('propertiesPanel.updated', updateSpy);

      createBpmnPropertiesPanel({ container, eventBus });

      // when
      eventBus.fire('root.added', { element: noopElement });

      // then
      expect(updateSpy).to.have.been.calledOnce;
    });


    it('should update on selection changed', function() {

      // given
      const updateSpy = sinon.spy();

      const eventBus = new eventBusMock();

      eventBus.on('propertiesPanel.updated', updateSpy);

      createBpmnPropertiesPanel({ container, eventBus });

      // when
      eventBus.fire('selection.changed', { newSelection: [ noopElement ] });

      // then
      expect(updateSpy).to.have.been.calledOnce;
    });


    it('should update on element changed', function() {

      // given
      const updateSpy = sinon.spy();

      const eventBus = new eventBusMock();

      eventBus.on('propertiesPanel.updated', updateSpy);

      createBpmnPropertiesPanel({ container, eventBus });

      // when
      eventBus.fire('elements.changed', { elements: [ noopElement ] });

      // then
      expect(updateSpy).to.have.been.calledOnce;
    });


    it('should update on providers changed', function() {

      // given
      const updateSpy = sinon.spy();

      const eventBus = new eventBusMock();

      eventBus.on('propertiesPanel.updated', updateSpy);

      createBpmnPropertiesPanel({ container, eventBus });

      // when
      eventBus.fire('propertiesPanel.providersChanged');

      // then
      expect(updateSpy).to.have.been.calledOnce;
    });


    it('should notify on layout changed', function() {

      // given
      const updateSpy = sinon.spy();

      const eventBus = new eventBusMock();

      eventBus.on('propertiesPanel.layoutChanged', updateSpy);

      // when
      createBpmnPropertiesPanel({ container, eventBus });

      // then
      expect(updateSpy).to.have.been.calledOnce;
    });


    it('should notify on properties panel changed', function() {

      // given
      const updateSpy = sinon.spy();

      const eventBus = new eventBusMock();

      eventBus.on('propertiesPanel.updated', updateSpy);

      createBpmnPropertiesPanel({ container, eventBus });

      // when
      eventBus.fire('propertiesPanel.providersChanged');

      // then
      expect(updateSpy).to.have.been.calledOnce;
    });

  });

});


// helpers /////////////////////////

function createBpmnPropertiesPanel(options = {}) {

  const {
    element = noopElement,
    injector = new injectorMock(options),
    getProviders = getProvidersMock,
    layoutConfig,
    container
  } = options;

  return render(
    <BpmnPropertiesPanel
      element={ element }
      injector={ injector }
      getProviders={ getProviders }
      layoutConfig={ layoutConfig }
    />,
    {
      container
    }
  );
}