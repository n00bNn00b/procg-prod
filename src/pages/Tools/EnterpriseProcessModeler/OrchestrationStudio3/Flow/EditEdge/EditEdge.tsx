import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edge } from "@xyflow/react";
import { X } from "lucide-react";
import { Dispatch, FC, SetStateAction, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface EditNodeProps {
  setEdges: (payload: Edge[] | ((edges: Edge[]) => Edge[])) => void;
  selectedEdge: any;
  setSelectedEdge: Dispatch<SetStateAction<Edge | undefined>>;
}
const EditEdge: FC<EditNodeProps> = ({
  setEdges,
  selectedEdge,
  setSelectedEdge,
}) => {
  const FormSchema = z.object({
    label: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      label: selectedEdge.label ?? "",
    },
  });
  useEffect(() => {
    form.reset({
      label: selectedEdge?.label ?? "",
    });
  }, [selectedEdge, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log(data, "data");
    if (selectedEdge) {
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
    if (selectedEdge) {
      setEdges((prevEdges: Edge[]) =>
        prevEdges.filter((edge: Edge) => edge.id !== selectedEdge.id)
      );
      setSelectedEdge(undefined);
    }
  }, []);
  return (
    <>
      {selectedEdge && (
        <div className="mt-1 bg-slate-100 rounded p-4">
          {selectedEdge && (
            <div>
              <div className="flex items-center justify-between">
                <div>Properties</div>
                <X
                  size={20}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedEdge(undefined);
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
                      <h3>Delete Edge</h3>
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

export default EditEdge;
