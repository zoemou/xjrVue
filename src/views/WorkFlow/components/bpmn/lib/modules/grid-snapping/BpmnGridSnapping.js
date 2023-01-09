import { isAny } from "../modeling/util/ModelingUtil";
import { initProperties } from "./../../../common/util/properties"; //新建元素后添加默认属性

export default function BpmnGridSnapping(eventBus) {
  eventBus.on(["create.init"], function(event) {
    var shape = event.shape;
    initProperties(shape.id, shape.type); //新建元素后添加默认属性
    if (shape.children.length > 0) {
      shape.children.forEach(element => {
        initProperties(element.id, element.type); //新建元素后添加默认属性
      });
    }
  });
  eventBus.on(["create.init", "shape.move.init"], function(event) {
    var context = event.context,
      shape = event.shape;
    if (
      isAny(shape, [
        "bpmn:Participant",
        "bpmn:SubProcess",
        "bpmn:TextAnnotation"
      ])
    ) {
      if (!context.gridSnappingContext) {
        context.gridSnappingContext = {};
      }

      context.gridSnappingContext.snapLocation = "top-left";
    }
  });
}

BpmnGridSnapping.$inject = ["eventBus"];
