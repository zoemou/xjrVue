export function randomStr() {
  return Math.random()
    .toString(36)
    .slice(-8);
}
export const objToStrMap = obj => {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
};
export const strMapToObj = strMap => {
  let obj = Object.create(null);
  for (let [k, v] of strMap) {
    obj[k] = v;
  }
  return obj;
};
export const strMapToJson = strMap => {
  return strMapToObj(strMap);
};
export const getRandomNumber = () => {
  return new Date().valueOf() + Math.floor(Math.random() * 100000000 + 1);
};
export const getInitbpmXml = ({ id, name }) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:flowable="http://flowable.org/bpmn" targetNamespace="http://www.flowable.org/processdef">
      <process id="${id}" name="${name}">
      </process>
      <bpmndi:BPMNDiagram id="BPMNDiagram_flow">
        <bpmndi:BPMNPlane id="BPMNPlane_flow" bpmnElement="T-2d89e7a3-ba79-4abd-9f64-ea59621c258c">
          <bpmndi:BPMNShape id="BPMNShape_startNode1" bpmnElement="startNode1" bioc:stroke="">
            <omgdc:Bounds x="240" y="200" width="30" height="30" />
            <bpmndi:BPMNLabel>
              <omgdc:Bounds x="242" y="237" width="23" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNShape>
        </bpmndi:BPMNPlane>
      </bpmndi:BPMNDiagram>
    </definitions>
    `;
};
