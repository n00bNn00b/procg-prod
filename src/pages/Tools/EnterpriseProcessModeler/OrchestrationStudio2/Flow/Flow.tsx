import {
  DragEvent,
  DragEventHandler,
  useCallback,
  useRef,
  useState,
} from "react";
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
  useNodesState,
  useEdgesState,
  Edge,
  Connection,
  addEdge,
} from "@xyflow/react";
import { useControls } from "leva";

import "@xyflow/react/dist/style.css";

import { defaultNodes, defaultEdges } from "./initial-elements";
import ShapeNodeComponent from "./shape-node";
import Sidebar from "./sidebar";
import MiniMapNode from "./minimap-node";
import { ShapeNode, ShapeType } from "./shape/types";
import "./ProFlow.css";
import FlowItems from "./components/FlowItems";
import { IOrchestrationDataTypes } from "@/types/interfaces/orchestration.interface";
import AnimatedSVGEdge from "./EdgeTypes/AnimatedSVGEdge";

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
  const { screenToFlowPosition } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<ShapeNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedFlowData, setSelectedFlowData] =
    useState<IOrchestrationDataTypes>();
  const [selectedNode, setSelectedNode] = useState<ShapeNode | undefined>(
    undefined
  );
  const [selectedEdge, setSelectedEdge] = useState<Edge | undefined>(undefined);

  console.log(selectedNode, selectedEdge, "nodes,selectedEdge");

  const edgeTypes = {
    animatedEdge: AnimatedSVGEdge,
  };

  const onConnect = useCallback((params: Connection) => {
    const edge: Edge = {
      ...params,
      id: `edge-${params.source}-${params.target}`,
      type: "animatedEdge",
      animated: false,
    };
    setEdges((eds) => addEdge(edge, eds));
  }, []);

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
      // id: Date.now().toString(),
      id: `node-${Math.random().toString(36).substr(2, 9)}`,
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

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: ShapeNode) => {
      console.log(event, "Node event");
      setSelectedEdge(undefined);
      setSelectedNode(node);
    },
    []
  );

  const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    console.log(event, "Edge event");
    setSelectedNode(undefined);
    setSelectedEdge(edge);
  };

  console.log(defaultNodes, defaultEdges, "defaultNodes, defaultEdges");
  console.log(nodes, edges, "nodes,edges");
  return (
    <div className="dndflow h-[calc(100vh-6rem)]">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          edgeTypes={edgeTypes}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          colorMode={theme}
          proOptions={proOptions}
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          // defaultNodes={defaultNodes}
          // defaultEdges={defaultEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
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
          <FlowItems
            setNodes={setNodes}
            setEdges={setEdges}
            selectedFlowData={selectedFlowData}
            setSelectedFlowData={setSelectedFlowData}
          />
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
