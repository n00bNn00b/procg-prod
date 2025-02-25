import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edge, Node } from "@xyflow/react";
import { EllipsisVertical } from "lucide-react";
import { Dispatch, FC, SetStateAction, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface EditNodeProps {
  setNodes: (payload: Node[] | ((nodes: Node[]) => Node[])) => void;
  setEdges: (payload: Edge[] | ((edges: Edge[]) => Edge[])) => void;
  selectedNode: any;
  setSelectedNode: Dispatch<SetStateAction<Node | undefined>>;
  selectedEdge: any;
  setSelectedEdge: Dispatch<SetStateAction<Edge | undefined>>;
  editingNodeId: string | null;
  setEditingNodeId: (id: string | null) => void;
  setIsEditableEdge: (value: boolean) => void;
  isEditableEdge: boolean;
  newLabel: string;
  // description: string;
  // handleKeyDown: (e: React.KeyboardEvent) => void;
}
const EditNode: FC<EditNodeProps> = ({
  setNodes,
  setEdges,
  selectedNode,
  setSelectedNode,
  selectedEdge,
  setSelectedEdge,
}) => {
  const FormSchema = z.object({
    label: z.string().optional(),
    description: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      label: selectedNode?.data?.label ?? selectedEdge.label ?? "",
      description: selectedNode?.data?.description ?? "",
    },
  });
  useEffect(() => {
    form.reset({
      label: selectedNode?.data?.label ?? selectedEdge?.label ?? "",
      description: selectedNode?.data?.description ?? "",
    });
  }, [selectedNode, selectedEdge, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log(data, "data");
    if (selectedNode) {
      setNodes((prevNodes: Node[]) =>
        prevNodes.map((node: Node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                label: data.label,
                description: data.description,
              },
            };
          }
          return node;
        })
      );
      setSelectedNode(undefined);
    } else {
      setEdges((prevNodes: Edge[]) =>
        prevNodes.map((edge: Edge) => {
          if (edge.id === selectedEdge.id) {
            return {
              ...edge,
              label: data.label,
            };
          }
          return edge;
        })
      );
      setSelectedEdge(undefined);
    }
  };

  const handleDelete = useCallback(() => {
    if (selectedNode) {
      setNodes((prevNodes: Node[]) =>
        prevNodes.filter((node: Node) => node.id !== selectedNode.id)
      );
      setSelectedNode(undefined);
    } else {
      setEdges((prevEdges: Edge[]) =>
        prevEdges.filter((edge: Edge) => edge.id !== selectedEdge.id)
      );
      setSelectedEdge(undefined);
    }
  }, []);
  return (
    <>
      {(selectedNode || selectedEdge) && (
        <div className="mt-1 bg-slate-100 rounded p-4">
          {(selectedNode || selectedEdge) && (
            <div>
              <div className="flex items-center justify-between">
                <div>Properties</div>
                <EllipsisVertical size={20} />
              </div>
              <hr className="my-2" />
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2"
                >
                  <div className="flex flex-col gap-4">
                    <FormField
                      control={form.control}
                      name="label"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Label</FormLabel>
                          <FormControl>
                            <Input {...field} required placeholder="Label" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {!selectedEdge && (
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Description" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between gap-1">
                    <button
                      type="submit"
                      className="cursor-pointer  p-1 flex justify-center rounded border border-green-500"
                    >
                      <h3>Save</h3>
                    </button>
                    <span
                      onClick={handleDelete}
                      className="cursor-pointer p-1 flex justify-center rounded border border-red-500"
                    >
                      {selectedNode ? (
                        <h3>Delete Node</h3>
                      ) : (
                        <h3>Delete Edge</h3>
                      )}
                    </span>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default EditNode;
