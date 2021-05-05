import {
  useContext
} from 'preact/hooks';

import {
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import {
  BpmnPropertiesPanelContext
} from '../../../context';

import {
  useService
} from '../../../hooks';

import InputOutputParameter from './InputOutputParameter';

import {
  getOutputParameters,
  getIoMapping,
  createIOMapping
} from '../utils/InputOutputUtil';

import {
  createElement,
  nextId
} from '../utils/ElementUtil';


export default function OutputProperties(element) {
  const outputParameters = getOutputParameters(element) || [];

  const items = outputParameters.map((parameter, idx) => {
    return {
      id: 'output-' + idx,
      label: parameter.get('target'),
      entries: InputOutputParameter({
        element,
        parameter
      })
    };
  });

  return {
    items,
    add: AddOutputParameter
  };
}

function AddOutputParameter(props) {
  const {
    children
  } = props;

  const {
    selectedElement: element
  } = useContext(BpmnPropertiesPanelContext);

  const bpmnFactory = useService('bpmnFactory');

  const commandStack = useService('commandStack');

  const addElement = (event) => {

    event.stopPropagation();

    let commands = [];

    const businessObject = getBusinessObject(element);

    let extensionElements = businessObject.get('extensionElements');

    // (1) ensure extension elements
    if (!extensionElements) {
      extensionElements = createElement(
        'bpmn:ExtensionElements',
        { values: [] },
        businessObject,
        bpmnFactory
      );

      commands.push({
        cmd: 'properties-panel.update-businessobject',
        context: {
          element: element,
          businessObject: businessObject,
          properties: { extensionElements }
        }
      });
    }

    // (2) ensure IoMapping
    let ioMapping = getIoMapping(element);

    if (!ioMapping) {
      const parent = extensionElements;

      ioMapping = createIOMapping({
        inputParameters: [],
        outputParameters: []
      }, parent, bpmnFactory);

      commands.push({
        cmd: 'properties-panel.update-businessobject-list',
        context: {
          element: element,
          currentObject: extensionElements,
          propertyName: 'values',
          objectsToAdd: [ ioMapping ]
        }
      });
    }

    // (3) create parameter
    const newParameter = createElement('zeebe:Output', {
      source: '= source',
      target: nextId('OutputVariable_')
    }, ioMapping, bpmnFactory);

    // (4) add parameter to list
    commands.push({
      cmd: 'properties-panel.update-businessobject-list',
      context: {
        element: element,
        currentObject: ioMapping,
        propertyName: 'outputParameters',
        objectsToPrepend: [ newParameter ]
      }
    });

    commandStack.execute('properties-panel.multi-command-executor', commands);
  };

  return (
    <div onClick={ addElement }>
      {
        children
      }
    </div>
  );
}