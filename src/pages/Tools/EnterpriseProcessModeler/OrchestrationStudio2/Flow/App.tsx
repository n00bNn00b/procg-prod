import { DragEvent, DragEventHandler, useRef } from "react";
import {
  ReactFlow,
  Background,
  ReactFlowProvider,
  ConnectionLineType,
  MarkerType,
  ConnectionMode,
  Panel,
  NodeTypes,
  DefaultEdgeOptions,
  Controls,
  useReactFlow,
  MiniMap,
} from "@xyflow/react";
import { useControls } from "leva";

import "@xyflow/react/dist/style.css";

import { defaultNodes, defaultEdges } from "./initial-elements";
import ShapeNodeComponent from "./shape-node";
import Sidebar from "./sidebar";
import MiniMapNode from "./minimap-node";
import { ShapeNode, ShapeType } from "./shape/types";
import "./ProFlow.css";

const nodeTypes: NodeTypes = {
  shape: ShapeNodeComponent,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "smoothstep",
  markerEnd: { type: MarkerType.ArrowClosed },
  style: { strokeWidth: 2 },
};

const proOptions = { account: "paid-pro", hideAttribution: true };

type ExampleProps = {
  theme?: "dark" | "light";
  snapToGrid?: boolean;
  panOnScroll?: boolean;
  zoomOnDoubleClick?: boolean;
};

function ShapesProExampleApp({
  theme = "light",
  snapToGrid = true,
  panOnScroll = true,
  zoomOnDoubleClick = false,
}: ExampleProps) {
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition, setNodes } = useReactFlow<ShapeNode>();

  const onDragOver = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "move";
  };

  // this function is called when a node from the sidebar is dropped onto the react flow pane
  const onDrop: DragEventHandler = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    const type = evt.dataTransfer.getData("application/reactflow") as ShapeType;

    // this will convert the pixel position of the node to the react flow coordinate system
    // so that a node is added at the correct position even when viewport is translated and/or zoomed in
    const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });

    const newNode: ShapeNode = {
      id: Date.now().toString(),
      type: "shape",
      position,
      style: { width: 100, height: 100 },
      data: {
        type,
        color: "#3F8AE2",
      },
      selected: true,
    };

    setNodes((nodes) =>
      (nodes.map((n) => ({ ...n, selected: false })) as ShapeNode[]).concat([
        newNode,
      ])
    );
  };

  return (
    <div className="dndflow h-[calc(100vh-6rem)]">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          colorMode={theme}
          proOptions={proOptions}
          nodeTypes={nodeTypes}
          defaultNodes={defaultNodes}
          defaultEdges={defaultEdges}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          connectionMode={ConnectionMode.Loose}
          panOnScroll={panOnScroll}
          onDrop={onDrop}
          snapToGrid={snapToGrid}
          snapGrid={[10, 10]}
          onDragOver={onDragOver}
          zoomOnDoubleClick={zoomOnDoubleClick}
          className="v2"
        >
          <Background />
          <Panel position="top-left">
            <Sidebar />
          </Panel>
          <Controls style={{ bottom: 155 }} orientation="horizontal" />
          <MiniMap
            zoomable
            draggable
            nodeComponent={MiniMapNode}
            position="bottom-left"
          />
        </ReactFlow>
      </div>
    </div>
  );
}

function ProWorkFlowMain() {
  // 👇 this renders a leva control panel to interactively configure the example
  // you can safely remove this in your own app
  const props = useControls({
    theme: { options: ["dark", "light"] },
    snapToGrid: true,
    panOnScroll: true,
    zoomOnDoubleClick: false,
  });

  return (
    <ReactFlowProvider>
      <ShapesProExampleApp {...(props as ExampleProps)} />
    </ReactFlowProvider>
  );
}

export default ProWorkFlowMain;
