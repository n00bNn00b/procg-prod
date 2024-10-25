import { Delete } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { Check } from "lucide-react";
import { ICreateAccessPointsElementTypes } from "@/types/interfaces/ManageAccessEntitlements.interface";
import { Button } from "@/components/ui/button";
import { useManageAccessEntitlementsContext } from "@/Context/ManageAccessEntitlements/ManageAccessEntitlementsContext";
import { toast } from "@/components/ui/use-toast";

const RelationAccessPoint = ({ tableRow }: { tableRow: () => void }) => {
  const {
    fetchAccessPointsData,
    selectedManageAccessEntitlements,
    createAccessEntitlementElements,
    fetchAccessEtitlementElenents,
    isLoading,
    selectedAccessEntitlementElements,
    setSelectedAccessEntitlementElements,
    deleteAccessEntitlementElement,
  } = useManageAccessEntitlementsContext();
  const [unUsedAccessPoints, setUnUsedAccessPoints] = useState<
    ICreateAccessPointsElementTypes[]
  >([]);
  const [selectedItem, setSelectedItem] = useState<
    ICreateAccessPointsElementTypes[]
  >([]);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const fetchAccessPoints = async () => {
      setSelectedItem([]);
      //get Access Points Data
      const accessPoints = await fetchAccessPointsData();
      // get access entitlement elements
      const res = await fetchAccessEtitlementElenents();
      if (Array.isArray(res) && res.length > 0) {
        const filterData = await accessPoints?.filter(
          (item1) =>
            !res.some(
              (item2) => item2.access_point_id === item1.access_point_id
            )
        );
        setUnUsedAccessPoints(filterData as ICreateAccessPointsElementTypes[]);
      } else {
        setUnUsedAccessPoints(
          accessPoints as ICreateAccessPointsElementTypes[]
        );
      }
    };

    fetchAccessPoints();
  }, [isLoading]);

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const filterdAccessPoints = unUsedAccessPoints.filter((item) =>
    item.element_name.toLowerCase().includes(query.toLowerCase())
  );
  const handleSelect = (selectItem: ICreateAccessPointsElementTypes) => {
    setSelectedItem((prevSelected) => {
      const isSelected = prevSelected.some(
        (item) => item.access_point_id === selectItem.access_point_id
      );

      if (isSelected) {
        // If the item is already selected, remove it
        return prevSelected.filter(
          (item) => item.access_point_id !== selectItem.access_point_id
        );
      } else {
        // If the item is not selected, add it
        return [...prevSelected, selectItem];
      }
    });
  };

  const handleRemoveReciever = (reciever: ICreateAccessPointsElementTypes) => {
    const newRecipients = selectedItem?.filter((rcvr) => rcvr !== reciever);
    setSelectedItem(newRecipients);
  };

  const handleSelectAll = () => {
    setSelectedItem(unUsedAccessPoints ?? []);
  };
  const handleRemoveSeletedItems = () => {
    setSelectedItem([]);
  };
  const handleAdd = async () => {
    const selectedIds = selectedItem?.map((item) => item.access_point_id);
    createAccessEntitlementElements(
      selectedManageAccessEntitlements?.entitlement_id
        ? selectedManageAccessEntitlements.entitlement_id
        : 0,
      selectedIds
    );
    toast({
      title: "Success",
      description: `Data added successfully to ${selectedManageAccessEntitlements?.entitlement_name}`,
    });
  };
  const handleRemoveAccessEntitlementElements = () => {
    for (const item of selectedAccessEntitlementElements) {
      deleteAccessEntitlementElement(
        selectedManageAccessEntitlements?.entitlement_id as number,
        item
      );
    }
    tableRow();
    setSelectedAccessEntitlementElements([]);
  };

  return (
    <div>
      <div className="flex gap-4">
        <div className="h-44 w-80 overflow-y-auto scrollbar-thin border rounded-sm ">
          <input
            type="text"
            className="sticky top-0 w-full bg-light-100 border-b border-light-400 outline-none px-2 py-1"
            placeholder="Element Name ..."
            autoFocus
            value={query}
            onChange={handleQueryChange}
          />
          <div className="flex flex-col gap-2 p-2">
            {unUsedAccessPoints?.length > 1 && (
              <span
                onClick={
                  selectedItem?.length !== unUsedAccessPoints?.length
                    ? handleSelectAll
                    : handleRemoveSeletedItems
                }
                className="flex justify-between px-2 items-center hover:bg-light-200 cursor-pointer border rounded"
              >
                <p>{unUsedAccessPoints?.length > 1 && "All"}</p>
                {selectedItem?.length === unUsedAccessPoints?.length &&
                unUsedAccessPoints?.length > 1 ? (
                  <Check size={14} color="#038C5A" />
                ) : null}
              </span>
            )}
            {isLoading && <p>Loading...</p>}
            {filterdAccessPoints?.map((item) => (
              <div
                onClick={() => handleSelect(item)}
                key={item.access_point_id}
                className="flex justify-between px-2 items-center hover:bg-light-200 cursor-pointer border rounded"
              >
                <p>
                  {item.element_name.slice(0, 20)}
                  {item.element_name.slice(0, 20).length === 20 && "..."}
                </p>
                {selectedItem?.some(
                  (selected) =>
                    selected.access_point_id === item.access_point_id
                ) ? (
                  <Check size={14} color="#038C5A" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between py-4">
          <div className="flex flex-col gap-2">
            <>
              <Button onClick={handleAdd} disabled={selectedItem?.length === 0}>
                <h3>Add</h3>
              </Button>
              <Button
                disabled={selectedItem?.length === 0}
                onClick={handleRemoveSeletedItems}
              >
                <h3>Cancel</h3>
              </Button>
              <Button
                disabled={selectedAccessEntitlementElements?.length === 0}
                onClick={handleRemoveAccessEntitlementElements}
              >
                <h3>Remove</h3>
              </Button>
            </>
          </div>
        </div>
        {/* w-[calc(100%-11rem)] */}
        <div className="w-[calc(100%-11rem)] scrollbar-thin border rounded-sm p-3">
          <div className="rounded-sm max-h-[10rem] scrollbar-thin flex flex-wrap gap-1 justify-end">
            {selectedItem?.map((rec) => (
              <div
                key={rec.access_point_id}
                className="flex gap-1 bg-winter-100 h-8 px-3 items-center rounded-full"
              >
                <p className="font-semibold ">{rec.element_name}</p>
                <div
                  onClick={() => handleRemoveReciever(rec)}
                  className="flex h-[65%] items-end cursor-pointer"
                >
                  <Delete size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default RelationAccessPoint;
