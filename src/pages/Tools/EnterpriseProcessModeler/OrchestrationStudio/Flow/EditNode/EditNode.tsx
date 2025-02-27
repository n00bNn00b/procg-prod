import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edge, Node } from "@xyflow/react";
import { EllipsisVertical, X } from "lucide-react";
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
  // description: string;
  // handleKeyDown: (e: React.KeyboardEvent) => void;
  setIsAddAttribute: Dispatch<SetStateAction<boolean>>;
}
const EditNode: FC<EditNodeProps> = ({
  setNodes,
  setEdges,
  selectedNode,
  setSelectedNode,
  selectedEdge,
  setSelectedEdge,
  setIsAddAttribute,
}) => {
  const FormSchema = z.object(
    selectedNode
      ? Object.keys(selectedNode.data).reduce((acc, key) => {
          const value = selectedNode.data[key];

          if (key === "attributes" && Array.isArray(value)) {
            acc[key] = z.array(
              z.object({
                id: z.number(),
                attribute_name: z.string(),
                attribute_value: z.string(),
              })
            );
          } else if (key === "label") {
            acc[key] = z.string();
          } else {
            acc[key] = z.unknown();
          }

          return acc;
        }, {} as Record<string, z.ZodType<any>>)
      : {}
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: selectedNode ? selectedNode.data : {},
  });

  useEffect(() => {
    if (selectedNode?.data) {
      form.reset(selectedNode ? selectedNode.data : {});
    }
    // form.reset({
    //   label: selectedNode?.data?.label ?? selectedEdge?.label ?? "",
    //   description: selectedNode?.data?.description ?? "",
    // });
  }, [selectedNode, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log(data, "data");
    if (selectedNode) {
      setNodes((prevNodes: Node[]) =>
        prevNodes.map((node: Node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              data,
            };
          }
          return node;
        })
      );
      setSelectedNode(undefined);
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
  const handleRemoveAttribute = (key: string) => {
    if (selectedNode) {
      setSelectedNode((prevNode) =>
        prevNode
          ? {
              ...prevNode,
              data: Object.fromEntries(
                Object.entries(prevNode.data).filter(([k]) => k !== key)
              ),
            }
          : prevNode
      );
    }
  };
  console.log(selectedNode, "selectedNode edit page");
  return (
    <>
      {selectedNode && (
        <div className="mt-1 bg-slate-100 rounded p-4 max-h-[60vh] overflow-y-auto">
          {selectedNode && (
            <div>
              <div className="flex items-center justify-between">
                <div>Properties</div>

                <Popover>
                  <PopoverTrigger asChild>
                    <button>
                      <EllipsisVertical size={20} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40">
                    <span
                      onClick={() => setIsAddAttribute(true)}
                      className="cursor-pointer"
                    >
                      Add Attribute
                    </span>
                  </PopoverContent>
                </Popover>
                <X
                  size={20}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedEdge(undefined);
                    setSelectedNode(undefined);
                  }}
                />
              </div>
              <hr className="my-2" />
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2"
                >
                  <div className="flex flex-col gap-4">
                    {Object.keys(selectedNode?.data).map((key, index) => {
                      if (key === "label") {
                        return (
                          <FormField
                            key={index}
                            control={form.control}
                            name={key}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  <span className="flex justify-between">
                                    <span>{key}</span>
                                    <>
                                      {key !== "label" && (
                                        <X
                                          size={15}
                                          className="cursor-pointer"
                                          onClick={() =>
                                            handleRemoveAttribute(key)
                                          }
                                        />
                                      )}
                                    </>
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    value={field.value ?? ""}
                                    required
                                    placeholder={key}
                                    onBlur={() => {
                                      setSelectedNode((prev) => {
                                        if (prev) {
                                          return {
                                            ...prev,
                                            data: {
                                              ...prev.data,
                                              [key]: field.value,
                                            },
                                          };
                                        }
                                        return prev;
                                      });
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        );
                      } else if (key === "attributes") {
                        return selectedNode?.data?.attributes?.map(
                          (attribute: any, index: number) => (
                            <div key={index}>
                              <FormField
                                key={index}
                                control={form.control}
                                name={`attributes.${index}.attribute_value`} // Using index to ensure uniqueness
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      <span className="flex justify-between">
                                        <span>{attribute.attribute_name}</span>
                                        <X
                                          size={15}
                                          className="cursor-pointer"
                                          onClick={() =>
                                            handleRemoveAttribute(attribute.id)
                                          }
                                        />
                                      </span>
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        value={
                                          field.value ??
                                          attribute.attribute_value
                                        }
                                        required
                                        placeholder="Enter value"
                                        onBlur={() => {
                                          setSelectedNode((prev: any) => {
                                            if (prev) {
                                              const updatedAttributes = [
                                                ...prev.data.attributes,
                                              ];
                                              updatedAttributes[index] = {
                                                ...updatedAttributes[index],
                                                attribute_value: field.value, // Update the attribute_value on blur
                                              };
                                              return {
                                                ...prev,
                                                data: {
                                                  ...prev.data,
                                                  attributes: updatedAttributes,
                                                },
                                              };
                                            }
                                            return prev;
                                          });
                                        }}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          )
                        );
                      }
                    })}
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
                      <h3>Delete Node</h3>
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
