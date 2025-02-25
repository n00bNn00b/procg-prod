import { useRef, useCallback, DragEvent, useState, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
  Edge,
  Node,
  MiniMap,
  MarkerType,
  Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./index.css";

import { DnDProvider, useDnD } from "./DnDContext";
import Sidebar from "./Sidebar";
import { Plus, Save, SquareMenu } from "lucide-react";
import { IOrchestrationDataTypes } from "@/types/interfaces/orchestration.interface";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  // SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/Spinner/Spinner";
import StartNode from "./NodeTypes/StartNode";
import InitializationNode from "./NodeTypes/InitializationNode";
import GetDetailsNode from "./NodeTypes/GetDetailsNode";
import DecisionNode from "./NodeTypes/DecisionNode";
import AlternateProcessNode from "./NodeTypes/AlternateProcessNode";
import StopNode from "./NodeTypes/StopNode";
import EditNode from "./EditNode/EditNode";

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const api = useAxiosPrivate();
  const { type, label } = useDnD();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition } = useReactFlow();

  const [selectedNode, setSelectedNode] = useState<Node | undefined>(undefined);
  const [selectedEdge, setSelectedEdge] = useState<Edge | undefined>(undefined);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [isEditableEdge, setIsEditableEdge] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState<string>("");
  // const [description, setDescription] = useState("");
  const [flowsData, setFlowsData] = useState<IOrchestrationDataTypes[]>([]);
  const [selectedFlowName, setSelectedFlowName] = useState<string>("");
  const [selectedFlowData, setSelectedFlowData] =
    useState<IOrchestrationDataTypes>();
  const [isLoading, setIsLoading] = useState(false);

  const [createNewFlow, setCreateNewFlow] = useState(false);
  const [newProcessName, setNewProcessName] = useState("");

  const getId = () => `node-${Math.random().toString(36).substr(2, 9)}`;

  const nodeTypes = {
    start: StartNode,
    initialization: InitializationNode,
    getDetails: GetDetailsNode,
    decision: DecisionNode,
    alternateProcess: AlternateProcessNode,
    stop: StopNode,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/orchestration-studio-process");

        setFlowsData(response.data);
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          console.log(error.response.data);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [newProcessName]);

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

  // console.log(selectedFlow, "selectedFlow");
  const onConnect = useCallback((params: Connection) => {
    const edge: Edge = {
      ...params,
      id: `edge-${params.source}-${params.target}`,
      type: "smoothstep",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        // width: 20,
        // height: 20,
        // color: "#FF0072",
      },
      // style: {
      //   strokeWidth: 1,
      //   stroke: "#FF0072",
      // },
    };
    setEdges((eds) => addEdge(edge, eds));
  }, []);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      if (!type || !label) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${label}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type, label]
  );
  console.log(selectedNode, "selectedNode");
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log(event, "Node event");
    setSelectedEdge(undefined);
    setSelectedNode(node);
    setEditingNodeId(node.id);
    setNewLabel(node.data.label as string);
  }, []);
  const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    console.log(event, "Edge event");
    console.log(edge, "edge");
    setSelectedNode(undefined);
    setSelectedEdge(edge);
  };

  const lastNode = nodes.filter((node) => node.type === "stop");
  const handleSave = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    const id = Math.floor(Math.random() * 1000);
    if (edges.length > 0 && nodes.length > 0 && lastNode.length > 0) {
      const postData = {
        process_id: id,
        process_name: newProcessName,
        process_structure: {
          nodes,
          edges,
        },
      };
      const putData = {
        process_structure: {
          nodes,
          edges,
        },
      };
      try {
        if (newProcessName !== "") {
          const res = await api.post("/orchestration-studio-process", postData);

          toast({
            title: "Success",
            description: `${res.data.message}`,
          });
          setNewProcessName("");
          setSelectedFlowData(postData);
        } else if (selectedFlowData) {
          const res = await api.put(
            `/orchestration-studio-process/${selectedFlowData.process_id}`,
            putData
          );
          toast({
            title: "Success",
            description: `${res.data.message}`,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleToolsOpen = () => {
    if (newProcessName || selectedFlowName) {
      setToolsOpen(!toolsOpen);
    } else {
      toast({
        title: "Info!!",
        description: "Please create a flow first.",
      });
      return;
    }
  };

  return (
    <div className="dndflow h-[85vh]">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          attributionPosition="bottom-left"
          // fitView
          style={{ backgroundColor: "#F7F9FB" }}
          className="relative touch-flow"
        >
          <>
            <div className="flex items-center justify-center">
              {isLoading && (
                <div className="absolute z-50 top-5">
                  <Spinner color="red" size="40" />
                </div>
              )}
              {createNewFlow && (
                <div className="absolute z-50 top-5 bg-slate-300 p-3 border rounded">
                  <form>
                    <input
                      type="text"
                      value={newProcessName ?? ""}
                      placeholder="Flow Name"
                      onChange={(e) => {
                        setNewProcessName(e.target.value);
                      }}
                      autoFocus
                      className="px-2 py-1 rounded mr-2"
                    />
                    <button
                      className="bg-slate-200 p-1 rounded-l-md border-black border hover:bg-slate-300 hover:shadow"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEdges([]);
                        setNodes([]);
                        setSelectedNode(undefined);
                        setSelectedFlowName("");
                        setCreateNewFlow(false);
                      }}
                    >
                      Save
                    </button>
                    <button
                      className="bg-slate-200 p-1 rounded-r-md border-black border hover:bg-slate-300 hover:shadow"
                      onClick={(e) => {
                        e.preventDefault();
                        setCreateNewFlow(false);
                        // setNewProcessName("");
                      }}
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              )}
            </div>
            <div
              className={`${
                toolsOpen ? " " : ""
              } absolute z-50 rounded-2xl p-2 `}
            >
              <div className="flex flex-col gap-2">
                <span className="flex gap-2 items-center">
                  {/* Tools Icon */}
                  <div
                    onClick={handleToolsOpen}
                    className=" bg-slate-200 rounded-full p-2 text-2xl hover:bg-slate-300 hover:shadow cursor-pointer text-red-500"
                  >
                    <SquareMenu />
                  </div>
                  {/* Plus Icon */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setCreateNewFlow(true);
                    }}
                    className="cursor-pointer bg-slate-200 p-2 rounded-full text-2xl hover:bg-slate-300 hover:shadow"
                  >
                    <Plus />
                  </div>
                  {/* Save Icon */}
                  {edges.length > 0 &&
                    nodes.length > 0 &&
                    lastNode.length > 0 && (
                      <div
                        onClick={handleSave}
                        className="cursor-pointer bg-slate-200 p-2 rounded-full text-2xl hover:bg-slate-300 hover:shadow"
                      >
                        <Save />
                      </div>
                    )}

                  <h3 className={`${nodes.length > 0 ? "ml-5" : "ml-12"}`}>
                    {newProcessName.length > 0 ? (
                      <>Flow Name : {newProcessName}</>
                    ) : (
                      selectedFlowName.length > 0 && (
                        <>Flow Name : {selectedFlowName}</>
                      )
                    )}
                  </h3>
                </span>
                {toolsOpen && (
                  <div className="">
                    <Sidebar />
                  </div>
                )}
              </div>
            </div>
            <div
              className={`absolute top-2 right-2 z-50 p-2 flex flex-col gap-1`}
            >
              {/* select flow */}
              {flowsData.length > 0 && (
                <div>
                  <Select
                    value={selectedFlowName}
                    onValueChange={(process_name: string) => {
                      setSelectedFlowName(process_name);
                      setNewProcessName("");
                      setCreateNewFlow(false);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a flow" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {/* <SelectLabel>Flows</SelectLabel> */}
                        {flowsData.map((flow) => (
                          <SelectItem
                            key={flow.process_id}
                            value={flow.process_name}
                          >
                            {flow.process_name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {/* Edit node */}
              {(selectedNode || selectedEdge) && (
                <>
                  <EditNode
                    setNodes={setNodes}
                    setEdges={setEdges}
                    selectedNode={selectedNode}
                    editingNodeId={editingNodeId}
                    setEditingNodeId={setEditingNodeId}
                    setSelectedNode={setSelectedNode}
                    selectedEdge={selectedEdge}
                    setSelectedEdge={setSelectedEdge}
                    setIsEditableEdge={setIsEditableEdge}
                    isEditableEdge={isEditableEdge}
                    newLabel={newLabel}
                    // description={description}
                    // onInputChange={onInputChange}
                    // handleKeyDown={handleKeyDown}
                  />
                </>
              )}
            </div>
          </>
          <MiniMap position={"bottom-left"} zoomable pannable />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

const Flow: React.FC = () => (
  <ReactFlowProvider>
    <DnDProvider>
      <DnDFlow />
    </DnDProvider>
  </ReactFlowProvider>
);

export default Flow;
