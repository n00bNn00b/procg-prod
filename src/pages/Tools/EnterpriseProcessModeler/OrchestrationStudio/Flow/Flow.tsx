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
  Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./index.css";

import { DnDProvider, useDnD } from "./DnDContext";
import Sidebar from "./Sidebar";
import { Pen, Plus, Save, SquareMenu, Trash } from "lucide-react";
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
import EditEdge from "./EditEdge/EditEdge";
import AnimatedSVGEdge from "./EdgeTypes/AnimatedSVGEdge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  // const [isEditableEdge, setIsEditableEdge] = useState(false);
  // const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  // const [newLabel, setNewLabel] = useState<string>("");
  // const [description, setDescription] = useState("");
  const [flowsData, setFlowsData] = useState<IOrchestrationDataTypes[]>([]);
  const [selectedFlowName, setSelectedFlowName] = useState<string>("");
  const [selectedFlowData, setSelectedFlowData] =
    useState<IOrchestrationDataTypes>();
  const [isLoading, setIsLoading] = useState(false);
  const [isNewFlowCreated, setIsNewFlowCreated] = useState<number>(0);

  const [createNewFlow, setCreateNewFlow] = useState(false);
  const [newProcessName, setNewProcessName] = useState("");
  const [isAddAttribute, setIsAddAttribute] = useState(false);
  const [attributeName, setAttributeName] = useState("");

  const [isEditFlowName, setIsEditFlowName] = useState(false);

  const getId = () => `node-${Math.random().toString(36).substr(2, 9)}`;

  const nodeTypes = {
    start: StartNode,
    initialization: InitializationNode,
    getDetails: GetDetailsNode,
    decision: DecisionNode,
    alternateProcess: AlternateProcessNode,
    stop: StopNode,
  };
  const edgeTypes = {
    animatedEdge: AnimatedSVGEdge,
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

  // console.log(selectedFlow, "selectedFlow");
  const onConnect = useCallback((params: Connection) => {
    const edge: Edge = {
      ...params,
      id: `edge-${params.source}-${params.target}`,
      type: "animatedEdge",
      animated: false,
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

      // const nodeLabel = event.dataTransfer.getData("nodeLabel");
      // const nodeType = event.dataTransfer.getData("nodeType");
      const nodeColor = event.dataTransfer.getData("nodeColor");

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${label}`, attributes: [] },
        style: { backgroundColor: nodeColor },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type, label]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log(event, "Node event");
    setSelectedEdge(undefined);
    setSelectedNode(node);
  }, []);

  const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    console.log(event, "Edge event");
    setSelectedNode(undefined);
    setSelectedEdge(edge);
  };
  // console.log(nodes, "nodes");
  const lastNode = nodes.filter((node) => node.type === "stop");

  const handleToolsOpen = () => {
    if (selectedFlowData) {
      setToolsOpen(!toolsOpen);
    } else {
      toast({
        title: "Info!!",
        description: "Please create a flow first.",
      });
      return;
    }
  };

  const handleAddAttribute = () => {
    if (selectedNode && attributeName.trim() !== "") {
      setSelectedNode((prevNode: any) =>
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
    setAttributeName(""); // Reset the attribute name input
  };

  const handleCreateNewFlow = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (flowsData) {
        const flow = flowsData.find(
          (flow) => flow.process_name === newProcessName
        );
        if (flow) {
          toast({
            title: "Info!!",
            description: "Flow already exists.",
          });
        } else {
          const postData = {
            process_id: flowsData.length + 1,
            process_name: newProcessName,
            process_structure: { nodes: [], edges: [] },
          };
          const res = await api.post("/orchestration-studio-process", postData);
          if (res) {
            setSelectedFlowName(newProcessName);
            closeAllProgress();
            setCreateNewFlow(false);
            setSelectedFlowData(postData);

            toast({
              title: "Success",
              description: "New flow created successfully.",
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditFlowName = async () => {
    try {
      setIsLoading(true);
      const putData = {
        process_name: newProcessName,
      };
      const res = await api.put(
        `/orchestration-studio-process/process-name/${selectedFlowData?.process_id}`,
        putData
      );
      console.log(res, "res");
      if (res) {
        setSelectedFlowName(newProcessName);
        toast({
          title: "Success",
          description: "Flow name updated successfully.",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteFlow = async () => {
    try {
      const res = await api.delete(
        `/orchestration-studio-process/${selectedFlowData?.process_id}`
      );
      if (res) {
        closeAllProgress();
        setSelectedFlowData(undefined);
        setToolsOpen(false);
        toast({
          title: "Success",
          description: "Flow deleted successfully.",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    // const id = Math.floor(Math.random() * 1000);
    if (edges.length > 0 && nodes.length > 0 && lastNode.length > 0) {
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

  const closeAllProgress = () => {
    setEdges([]);
    setNodes([]);
    setSelectedNode(undefined);
    setSelectedEdge(undefined);
    setNewProcessName("");
    setIsNewFlowCreated(Math.random() * 9999);
  };

  return (
    <div className="dndflow h-[calc(100vh-6rem)]">
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
          edgeTypes={edgeTypes}
          attributionPosition="bottom-left"
          fitView
          style={{ backgroundColor: "#F7F9FB" }}
          panOnScroll
        >
          <>
            <div className="flex items-center justify-center">
              {isLoading && (
                <div className="absolute z-50 top-[45%]">
                  <Spinner color="red" size="40" />
                </div>
              )}
              {/* Create new flow */}
              {createNewFlow && (
                <div className="absolute z-50 top-5 bg-slate-300 p-3 border rounded">
                  <form onSubmit={handleCreateNewFlow}>
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
                      type="submit"
                      className="bg-slate-200 p-1 rounded-l-md border-black border hover:bg-slate-300 hover:shadow"
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
              {/* Add Attributes */}
              {isAddAttribute && (
                <div className="absolute z-50 top-5 bg-slate-300 p-3 border rounded">
                  <form>
                    <input
                      type="text"
                      value={attributeName ?? ""}
                      placeholder="Attribute Name"
                      onChange={(e) => {
                        setAttributeName(e.target.value);
                      }}
                      autoFocus
                      className="px-2 py-1 rounded mr-2"
                    />
                    <button
                      className="bg-slate-200 p-1 rounded-l-md border-black border hover:bg-slate-300 hover:shadow"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddAttribute();
                        setIsAddAttribute(false);
                      }}
                    >
                      Save
                    </button>
                    <button
                      className="bg-slate-200 p-1 rounded-r-md border-black border hover:bg-slate-300 hover:shadow"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsAddAttribute(false);
                      }}
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              )}
              {/* Edit Flow Name */}
              {isEditFlowName && (
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
                        handleEditFlowName();
                        setIsEditFlowName(false);
                      }}
                    >
                      Save
                    </button>
                    <button
                      className="bg-slate-200 p-1 rounded-r-md border-black border hover:bg-slate-300 hover:shadow"
                      onClick={() => setIsEditFlowName(false)}
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              )}
            </div>
            {/* Top left Tools Bar */}
            <div
              className={`${
                toolsOpen ? " " : ""
              } absolute z-50 rounded-2xl p-2 `}
            >
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  {/* Tools Icon */}
                  <div
                    onClick={handleToolsOpen}
                    className=" bg-slate-200 rounded-full p-2 text-2xl hover:bg-slate-300 hover:shadow cursor-pointer text-red-500"
                  >
                    <SquareMenu size={17} />
                  </div>
                  {/* Plus Icon */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setCreateNewFlow(true);
                    }}
                    className="cursor-pointer bg-slate-200 p-2 rounded-full text-2xl hover:bg-slate-300 hover:shadow"
                  >
                    <Plus size={17} />
                  </div>

                  {/* Pen Icon */}
                  {selectedFlowData && (
                    <div
                      onClick={() => {
                        setIsEditFlowName(true);
                        setNewProcessName(selectedFlowData?.process_name ?? "");
                      }}
                      className="cursor-pointer bg-slate-200 p-2 rounded-full text-2xl hover:bg-slate-300 hover:shadow"
                    >
                      <Pen size={17} />
                    </div>
                  )}
                  {/* Trash Flow */}
                  {selectedFlowData && (
                    <div className="cursor-pointer bg-slate-200 p-2 rounded-full text-2xl hover:bg-slate-300 hover:shadow">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Trash size={17} />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure delete flow?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your account and remove your
                              data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteFlow}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                  {/* Save Icon */}
                  {edges.length > 0 &&
                    nodes.length > 0 &&
                    lastNode.length > 0 && (
                      <div
                        onClick={handleSave}
                        className="cursor-pointer bg-slate-200 p-2 rounded-full text-2xl hover:bg-slate-300 hover:shadow"
                      >
                        <Save size={17} />
                      </div>
                    )}
                </div>
                {toolsOpen && (
                  <div className="">
                    <Sidebar />
                  </div>
                )}
              </div>
            </div>
            {/*Select Flow */}
            <div
              className={`absolute top-[2px] left-[220px] z-10 p-2 flex gap-1 items-center`}
            >
              <h3>Flow Name:</h3>

              {/* select flow */}
              {flowsData.length > 0 && (
                <div>
                  <Select
                    value={selectedFlowData?.process_name ?? ""}
                    onValueChange={(process_name: string) => {
                      setSelectedFlowName(process_name);
                      setNewProcessName("");
                      setCreateNewFlow(false);
                      setSelectedEdge(undefined);
                      setSelectedNode(undefined);
                    }}
                  >
                    <SelectTrigger className="w-[180px] h-[30px]">
                      <SelectValue placeholder="Select a Flow" />
                    </SelectTrigger>
                    <SelectContent className=" max-h-[15rem] ">
                      <SelectGroup>
                        {/* <SelectLabel>Flows</SelectLabel> */}
                        {flowsData.map((flow) => (
                          <SelectItem
                            key={flow.process_id}
                            value={flow.process_name}
                            className="cursor-pointer "
                          >
                            {flow.process_name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
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
          <MiniMap
            zoomable
            pannable
            offsetScale={0}
            className="z-40"
            ariaLabel={`${
              selectedFlowData?.process_name
                ? `${selectedFlowData?.process_name} Flow Map`
                : "Flow Map"
            }`}
            position={"bottom-left"}
          />
          <Controls style={{ bottom: 155 }} orientation="horizontal" />
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
