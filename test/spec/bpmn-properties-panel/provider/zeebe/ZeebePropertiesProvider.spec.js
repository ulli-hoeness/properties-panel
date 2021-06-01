import TestContainer from 'mocha-test-container-support';

import {
  act
} from '@testing-library/preact';

import {
  bootstrapPropertiesPanel,
  inject
} from 'test/TestHelper';

import {
  query as domQuery
} from 'min-dom';

import CoreModule from 'bpmn-js/lib/core';
import SelectionModule from 'diagram-js/lib/features/selection';
import ModelingModule from 'bpmn-js/lib/features/modeling';

import BpmnPropertiesPanel from 'src/bpmn-properties-panel';

import ZeebePropertiesProvider from 'src/bpmn-properties-panel/provider/zeebe';

import zeebeModdleExtensions from 'zeebe-bpmn-moddle/resources/zeebe';

import diagramXML from './ZeebePropertiesProvider.bpmn';


describe('<ZeebePropertiesProvider>', function() {

  const testModules = [
    BpmnPropertiesPanel,
    CoreModule,
    ModelingModule,
    SelectionModule,
    ZeebePropertiesProvider
  ];

  const moddleExtensions = {
    zeebe: zeebeModdleExtensions
  };

  let container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  beforeEach(bootstrapPropertiesPanel(diagramXML, {
    modules: testModules,
    moddleExtensions,
    debounceInput: false
  }));

  it('should NOT show input group', inject(async function(elementRegistry, selection) {

    // given
    const task = elementRegistry.get('Task_1');

    await act(() => {
      selection.select(task);
    });

    // when
    const inputGroup = getGroup(container, 'inputs');

    // then
    expect(inputGroup).to.not.exist;
  }));


  it('should show input group', inject(async function(elementRegistry, selection) {

    // given
    const serviceTask = elementRegistry.get('ServiceTask_1');

    await act(() => {
      selection.select(serviceTask);
    });

    // when
    const inputGroup = getGroup(container, 'inputs');

    // then
    expect(inputGroup).to.exist;
  }));


  it('should NOT show target group', inject(async function(elementRegistry, selection) {

    // given
    const task = elementRegistry.get('Task_1');

    await act(() => {
      selection.select(task);
    });

    // when
    const targetGroup = getGroup(container, 'target');

    // then
    expect(targetGroup).to.not.exist;
  }));


  it('should show target group', inject(async function(elementRegistry, selection) {

    // given
    const serviceTask = elementRegistry.get('CallActivity_1');

    await act(() => {
      selection.select(serviceTask);
    });

    // when
    const targetGroup = getGroup(container, 'target');

    // then
    expect(targetGroup).to.exist;
  }));


  it('should NOT show output group', inject(async function(elementRegistry, selection) {

    // given
    const task = elementRegistry.get('Task_1');

    await act(() => {
      selection.select(task);
    });

    // when
    const outputGroup = getGroup(container, 'outputs');

    // then
    expect(outputGroup).to.not.exist;
  }));



  it('should show output group', inject(async function(elementRegistry, selection) {

    // given
    const serviceTask = elementRegistry.get('ServiceTask_1');

    await act(() => {
      selection.select(serviceTask);
    });

    // when
    const outputGroup = getGroup(container, 'outputs');

    // then
    expect(outputGroup).to.exist;
  }));


  it('should NOT show task definition group', inject(async function(elementRegistry, selection) {

    // given
    const task = elementRegistry.get('Task_1');

    await act(() => {
      selection.select(task);
    });

    // when
    const taskDefinitionGroup = getGroup(container, 'taskDefinition');

    // then
    expect(taskDefinitionGroup).to.not.exist;
  }));


  it('should show taskDefinition group', inject(async function(elementRegistry, selection) {

    // given
    const serviceTask = elementRegistry.get('ServiceTask_1');

    await act(() => {
      selection.select(serviceTask);
    });

    // when
    const taskDefinitionGroup = getGroup(container, 'taskDefinition');

    // then
    expect(taskDefinitionGroup).to.exist;
  }));


  it('should NOT show multi instance group', inject(async function(elementRegistry, selection) {

    // given
    const task = elementRegistry.get('Task_1');

    await act(() => {
      selection.select(task);
    });

    // when
    const multiInstanceGroup = getGroup(container, 'multiInstance');

    // then
    expect(multiInstanceGroup).to.not.exist;
  }));


  it('should show multi instance group', inject(async function(elementRegistry, selection) {

    // given
    const serviceTask = elementRegistry.get('ServiceTask_1');

    await act(() => {
      selection.select(serviceTask);
    });

    // when
    const multiInstanceGroup = getGroup(container, 'multiInstance');

    // then
    expect(multiInstanceGroup).to.exist;
  }));


  it('should NOT show condition group', inject(async function(elementRegistry, selection) {

    // given
    const task = elementRegistry.get('Flow_1');

    await act(() => {
      selection.select(task);
    });

    // when
    const conditionGroup = getGroup(container, 'condition');

    // then
    expect(conditionGroup).to.not.exist;
  }));


  it('should show condition group', inject(async function(elementRegistry, selection) {

    // given
    const serviceTask = elementRegistry.get('Flow_2');

    await act(() => {
      selection.select(serviceTask);
    });

    // when
    const conditionGroup = getGroup(container, 'condition');

    // then
    expect(conditionGroup).to.exist;
  }));

});


// helpers /////////////////////

function getGroup(container, id) {
  return domQuery(`[data-group-id="group-${id}"`, container);
}