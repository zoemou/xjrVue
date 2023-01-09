let infoJson = {
  resourceId: "702509",
  properties: {
    process_id: "process",
    id: "",
    name: "",
    documentation: "",
    process_author: "",
    process_version: "",
    process_namespace: "http://www.activiti.org/processdef",
    executionlisteners: "",
    eventlisteners: "",
    signaldefinitions: "",
    messagedefinitions: ""
  },
  stencil: { id: "BPMNDiagram" },
  childShapes: [
    {
      resourceId: "startNode1",
      properties: {
        overrideid: "",
        name: "开始",
        documentation: "",
        executionlisteners: "",
        initiator: "",
        formkeydefinition: "",
        formproperties: ""
      },
      stencil: { id: "StartNoneEvent" },
      childShapes: [],
      outgoing: [{ resourceId: "Flow_0oyow5l" }],
      bounds: {
        lowerRight: { x: 315, y: 135 },
        upperLeft: { x: 285, y: 105 }
      },
      dockers: []
    },
    {
      resourceId: "Activity_0wdyucb",
      properties: {
        overrideid: "",
        name: "用户",
        documentation: "",
        asynchronousdefinition: "false",
        exclusivedefinition: "false",
        executionlisteners: "",
        multiinstance_type: "None",
        multiinstance_cardinality: "",
        multiinstance_collection: "",
        multiinstance_variable: "",
        multiinstance_condition: "",
        isforcompensation: "false",
        usertaskassignment: "",
        formkeydefinition: "",
        duedatedefinition: "",
        prioritydefinition: "",
        formproperties: "",
        tasklisteners: "",
        fkbuttonpopu: "",
        fkforwarderpackage: "",
        fkrelationregion: {
          relationformem: 1,
          showapproval: "all",
          needpassword: 1,
          approvalcomponents: []
        },
        fkformpopup: "",
        fksignature: "0"
      },
      stencil: { id: "UserTask" },
      childShapes: [],
      outgoing: [{ resourceId: "Flow_0fpj28d" }],
      bounds: {
        lowerRight: { x: 471.5, y: 167 },
        upperLeft: { x: 371.5, y: 87 }
      },
      dockers: []
    },
    {
      resourceId: "Flow_0oyow5l",
      properties: {
        overrideid: "",
        name: "",
        documentation: "",
        conditionsequenceflow: "",
        executionlisteners: "",
        defaultflow: "false"
      },
      stencil: { id: "SequenceFlow" },
      childShapes: [],
      outgoing: [{ resourceId: "Activity_0wdyucb" }],
      bounds: {
        lowerRight: { x: 370.982421875, y: 127 },
        upperLeft: { x: 315.8671875, y: 120 }
      },
      dockers: [
        { x: 15, y: 15 },
        { x: 343.25, y: 120 },
        { x: 343.25, y: 127 },
        { x: 50, y: 40 }
      ],
      target: { resourceId: "Activity_0wdyucb" }
    },
    {
      resourceId: "Event_187xn3e",
      properties: {
        overrideid: "",
        name: "结束",
        documentation: "",
        executionlisteners: ""
      },
      stencil: { id: "EndNoneEvent" },
      childShapes: [],
      outgoing: [],
      bounds: {
        lowerRight: { x: 544.5, y: 141 },
        upperLeft: { x: 516.5, y: 113 }
      },
      dockers: []
    },
    {
      resourceId: "Flow_0fpj28d",
      properties: {
        overrideid: "",
        name: "",
        documentation: "",
        conditionsequenceflow: "",
        executionlisteners: "",
        defaultflow: "false"
      },
      stencil: { id: "SequenceFlow" },
      childShapes: [],
      outgoing: [{ resourceId: "Event_187xn3e" }],
      bounds: {
        lowerRight: { x: 515.875, y: 127 },
        upperLeft: { x: 471.890625, y: 127 }
      },
      dockers: [
        { x: 50, y: 40 },
        { x: 14, y: 14 }
      ],
      target: { resourceId: "Event_187xn3e" }
    }
  ],
  bounds: { lowerRight: { x: 1800, y: 1575 }, upperLeft: { x: 0, y: 0 } }
};
let xml2 = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsd="http://www.w3.org/2001/XMLSchema" targetNamespace="http://www.flowable.org/processdef">
  <process id="process_cd9r5e8p" name="name_ztesectd">
    <startEvent id="Event_1wazwaj">
      <outgoing>Flow_1s4i3lo</outgoing>
    </startEvent>
    <userTask id="Activity_1l672in">
      <incoming>Flow_1s4i3lo</incoming>
      <outgoing>Flow_04a12f3</outgoing>
    </userTask>
    <sequenceFlow id="Flow_1s4i3lo" sourceRef="Event_1wazwaj" targetRef="Activity_1l672in" />
    <endEvent id="Event_07627qb">
      <incoming>Flow_04a12f3</incoming>
    </endEvent>
    <sequenceFlow id="Flow_04a12f3" sourceRef="Activity_1l672in" targetRef="Event_07627qb" />
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_flow">
    <bpmndi:BPMNPlane id="BPMNPlane_flow" bpmnElement="process_cd9r5e8p">
      <bpmndi:BPMNEdge id="Flow_1s4i3lo_di" bpmnElement="Flow_1s4i3lo">
        <di:waypoint x="-272" y="-170" />
        <di:waypoint x="-236" y="-170" />
        <di:waypoint x="-236" y="-110" />
        <di:waypoint x="-150" y="-110" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_04a12f3_di" bpmnElement="Flow_04a12f3">
        <di:waypoint x="-100" y="-150" />
        <di:waypoint x="-100" y="-216" />
        <di:waypoint x="100" y="-216" />
        <di:waypoint x="100" y="-158" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Event_1wazwaj_di" bpmnElement="Event_1wazwaj">
        <omgdc:Bounds x="-308" y="-188" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1l672in_di" bpmnElement="Activity_1l672in">
        <omgdc:Bounds x="-150" y="-150" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_07627qb_di" bpmnElement="Event_07627qb">
        <omgdc:Bounds x="82" y="-158" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>

`;
export default {
  xml: xml2,
  json: infoJson,
  F_Id: "424324234",
  name: "new-processW8p",
  description: "descriptionx59",
  bpmnName: "new-processW8p",
  json_bpmn: "",
  F_SchemeId: "",
  modelId: "692773",
  F_Type: "1",
  F_Code: "424324234",
  F_Name: "4324322423",
  F_Category: "人事类",
  F_RuleData: "",
  F_RuleName: "",
  F_Handle: "",
  F_Mark: 1,
  F_IsInApp: 2,
  F_Description: "",
  schemeAuthList: [{ F_Id: "160568952423306163086959181832", F_ObjType: "4" }]
};
