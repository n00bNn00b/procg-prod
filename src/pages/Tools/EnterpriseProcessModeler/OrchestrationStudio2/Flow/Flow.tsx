import {
  DragEvent,
  DragEventHandler,
  useCallback,
  useEffect,
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
import { Leva, useControls } from "leva";

import "@xyflow/react/dist/style.css";

import ShapeNodeComponent from "./shape-node";
import Sidebar from "./sidebar";
import MiniMapNode from "./minimap-node";
import { ShapeNode, ShapeType } from "./shape/types";
import "./ProFlow.css";
import FlowItems from "./components/FlowItems/FlowItems";
import { IOrchestrationDataTypes2 } from "@/types/interfaces/orchestration.interface";
import AnimatedSVGEdge from "./EdgeTypes/AnimatedSVGEdge";
import { Plus, Save } from "lucide-react";
import CreateAFlow from "./components/CreateAFlow/CreateAFlow";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { AxiosError } from "axios";
import Spinner from "@/components/Spinner/Spinner";
import { toast } from "@/components/ui/use-toast";
import EditNode from "./components/EditNode/EditNode";
import EditEdge from "./components/EditEdge/EditEdge";
import AddAttribute from "./components/AddAttribute/AddAttribute";

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
  const api = useAxiosPrivate();
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<ShapeNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedFlowData, setSelectedFlowData] =
    useState<IOrchestrationDataTypes2>();
  const [selectedNode, setSelectedNode] = useState<ShapeNode | undefined>(
    undefined
  );
  const [selectedEdge, setSelectedEdge] = useState<Edge | undefined>(undefined);

  const [isAddAttribute, setIsAddAttribute] = useState(false);
  const [newProcessName, setNewProcessName] = useState("");
  const [createNewFlow, setCreateNewFlow] = useState(false);
  const [selectedFlowName, setSelectedFlowName] = useState<string>("");
  const [isNewFlowCreated, setIsNewFlowCreated] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [flowsData, setFlowsData] = useState<IOrchestrationDataTypes2[]>([]);
  const [attributeName, setAttributeName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const resFlows = await api.get("/orchestration-studio-process");

        setFlowsData(resFlows.data);
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          console.log(error.response.data);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isNewFlowCreated, selectedFlowName]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedFlowName !== "") {
          setIsLoading(true);
          const res = await api.get(
            `/orchestration-studio-process/${selectedFlowName}`
          );
          setSelectedFlowData(res.data);
          setEdges(res.data.process_structure.edges);
          setNodes(res.data.process_structure.nodes);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedFlowName]);

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
    const colorType = () => {
      switch (type) {
        case "Start":
          return "#549C30";
        case "round-rectangle":
          return "#3F8AE2";
        case "rectangle":
          return "#3F8AE2";
        case "hexagon":
          return "#3F8AE2";
        case "diamond":
          return "#3F8AE2";
        case "parallelogram":
          return "#3F8AE2";
        case "Stop":
          return "#FF0000";
        default:
          return "#3F8AE2";
      }
    };
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
        label: type,
        step_function: "",
        attributes: [],
        type,
        color: colorType(),
      },
      selected: true,
    };

    setSelectedNode(newNode);
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
  const closeAllProgress = () => {
    setEdges([]);
    setNodes([]);
    setSelectedNode(undefined);
    setSelectedEdge(undefined);
    setNewProcessName("");
    setIsNewFlowCreated(Math.random() * 9999);
  };
  const handleCloseAfterSelectAFlow = () => {
    setNewProcessName("");
    setCreateNewFlow(false);
    setSelectedEdge(undefined);
    setSelectedNode(undefined);
  };

  const handleAddAttribute = () => {
    if (selectedNode && attributeName.trim() !== "") {
      setSelectedNode((prevNode: ShapeNode | undefined) =>
        prevNode
          ? {
              ...prevNode,
              data: {
                ...prevNode.data,
                attributes: [
                  ...(prevNode.data.attributes || []),
                  {
                    id: Date.now(),
                    attribute_name: attributeName,
                    attribute_value: "",
                  },
                ],
              },
            }
          : prevNode
      );
    }
    setAttributeName("");
  };

  const handleSave = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    // const id = Math.floor(Math.random() * 1000);
    if (edges.length > 0 && nodes.length > 0) {
      const putData = {
        process_structure: {
          nodes,
          edges,
        },
      };
      console.log(putData, "putData");
      try {
        if (selectedFlowData) {
          const res = await api.put(
            `/orchestration-studio-process/${selectedFlowData.process_id}`,
            JSON.stringify(putData)
          );
          console.log(res, "res");
          if (res) {
            toast({
              title: "Success",
              description: `Flow saved successfully.`,
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

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
          <>
            <div className="absolute top-[2px] left-[220px] z-50 flex gap-1 items-center ">
              {isLoading && (
                <div className="absolute left-[50%] top-[45%] z-50 translate-x-[-50%]">
                  <Spinner color="red" size="40" />
                </div>
              )}
              <div
                className={`flex gap-1 items-center ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                <div
                  className={`cursor-pointer p-1 border rounded-full ${
                    theme === "dark"
                      ? "bg-[#1e293b] hover:bg-[#415069] border-[#1e293b]"
                      : "bg-slate-300 hover:bg-slate-400"
                  }`}
                >
                  <Plus
                    size={15}
                    onClick={() => setCreateNewFlow(!createNewFlow)}
                  />
                </div>
                {nodes.length > 0 && edges.length > 0 && (
                  <div
                    onClick={handleSave}
                    className={`cursor-pointer p-1 border rounded-full ${
                      theme === "dark"
                        ? "bg-[#1e293b] hover:bg-[#415069] border-[#1e293b]"
                        : "bg-slate-300 hover:bg-slate-400"
                    }`}
                  >
                    <Save size={15} />
                  </div>
                )}
              </div>

              <FlowItems
                theme={theme}
                flowsData={flowsData}
                setNodes={setNodes}
                setEdges={setEdges}
                selectedFlowData={selectedFlowData}
                setSelectedFlowData={setSelectedFlowData}
                setSelectedFlowName={setSelectedFlowName}
                handleCloseAfterSelectAFlow={handleCloseAfterSelectAFlow}
              />
            </div>
            {isAddAttribute && (
              <AddAttribute
                attributeName={attributeName}
                setAttributeName={setAttributeName}
                handleAddAttribute={handleAddAttribute}
                setIsAddAttribute={setIsAddAttribute}
              />
            )}

            {createNewFlow && (
              <CreateAFlow
                flowsData={flowsData}
                newProcessName={newProcessName}
                setNewProcessName={setNewProcessName}
                setCreateNewFlow={setCreateNewFlow}
                setSelectedFlowData={setSelectedFlowData}
                setSelectedFlowName={setSelectedFlowName}
                closeAllProgress={closeAllProgress}
              />
            )}
            {/* Right Edit Bar */}
            <div
              className={`absolute top-[2px] right-0 z-50 p-2 flex flex-col gap-1`}
            >
              {/* Edit node */}
              {selectedNode && (
                <>
                  <EditNode
                    setNodes={setNodes}
                    selectedNode={selectedNode}
                    setSelectedNode={setSelectedNode}
                    setIsAddAttribute={setIsAddAttribute}
                  />
                </>
              )}
              {/* Edit edge */}
              {selectedEdge && (
                <>
                  <EditEdge
                    setEdges={setEdges}
                    selectedEdge={selectedEdge}
                    setSelectedEdge={setSelectedEdge}
                  />
                </>
              )}
            </div>
          </>

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
  const props = useControls({
    theme: {
      options: ["dark", "light"],
      value: "light",
    },
    snapToGrid: true,
    panOnScroll: true,
    zoomOnDoubleClick: false,
  });

  useEffect(() => {
    const styleElement = document.createElement("style");
    document.head.appendChild(styleElement);

    const themeStyles = `
      /* Apply background color to all Leva-related elements */
      #leva__root,
      .leva-c-kWgxhW,
      .leva-c-dmsJDs,
      .leva-c-grzFYX,
      .leva-c-bDGmTT,
      .leva-c-iSkYoW {
        background-color: ${
          props.theme === "dark" ? "#181c20" : "#f0f0f0"
        } !important;
        color: ${props.theme === "dark" ? "#d7d7d7" : "#000"} !important;
      }

      /* Apply color changes to :root and .leva-t-kqjEjX */
      :root {
        --leva-colors-elevation2: ${
          props.theme === "dark" ? "#292d39" : "#d7d7d7"
        } !important;
        --leva-colors-elevation3: ${
          props.theme === "dark" ? "#292d39" : "#d7d7d7"
        } !important;
        --leva-colors-background: ${
          props.theme === "dark" ? "#333" : "#fff"
        } !important;
        --leva-colors-text: ${
          props.theme === "dark" ? "#fff" : "#000"
        } !important;
      }

      .leva-t-kqjEjX {
        --leva-colors-elevation3: ${
          props.theme === "dark" ? "#444" : "#f2f2f2"
        } !important;
      }
      .leva-c-hwBXYF {
        height: 25px;
        background-color: ${
          props.theme === "dark" ? "#292d39" : "#d7d7d7"
        } !important;
        border-radius: 10px
      }
    `;

    styleElement.innerHTML = themeStyles;

    return () => {
      document.head.removeChild(styleElement);
    };
  }, [props.theme]);

  return (
    <ReactFlowProvider>
      <Leva
        collapsed
        // titleBar={{ title: "Control panel" }}
      />
      <ShapesProExampleApp {...(props as ExampleProps)} />
    </ReactFlowProvider>
  );
}

export default ProWorkFlowMain;
