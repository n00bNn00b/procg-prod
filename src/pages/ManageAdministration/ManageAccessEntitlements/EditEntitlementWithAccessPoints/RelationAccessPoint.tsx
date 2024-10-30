import { Delete } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { Check } from "lucide-react";
import { ICreateAccessPointsElementTypes } from "@/types/interfaces/ManageAccessEntitlements.interface";
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
import { Button } from "@/components/ui/button";
import { useManageAccessEntitlementsContext } from "@/Context/ManageAccessEntitlements/ManageAccessEntitlementsContext";
import Spinner from "@/components/Spinner/Spinner";

const RelationAccessPoint = ({ tableRow }: { tableRow: () => void }) => {
  const {
    fetchAccessPointsData,
    selectedManageAccessEntitlements,
    createAccessEntitlementElements,
    fetchAccessEtitlementElenents,
    selectedAccessEntitlementElements,
    setSelectedAccessEntitlementElements,
    deleteAccessEntitlementElement,
    isLoadingAccessPoints,
    page,
    setPage,
    totalPage,
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
      try {
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
          setUnUsedAccessPoints(
            filterData as ICreateAccessPointsElementTypes[]
          );
        } else {
          setUnUsedAccessPoints(
            accessPoints as ICreateAccessPointsElementTypes[]
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
      }
    };

    fetchAccessPoints();
  }, [isLoadingAccessPoints, page, fetchAccessPointsData.length]);

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
    try {
      const selectedIds = selectedItem?.map((item) => item.access_point_id);
      createAccessEntitlementElements(
        selectedManageAccessEntitlements?.entitlement_id
          ? selectedManageAccessEntitlements.entitlement_id
          : 0,
        selectedIds
      );
      console.log(selectedIds, "selectedIds");
    } catch (error) {
      console.log(error);
    }
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
    if (page > 1 && page === totalPage) {
      setPage(totalPage - 1);
    }
  };

  return (
    <div>
      <div className="flex gap-4">
        <div className="h-[12rem] w-80 overflow-y-auto scrollbar-thin border rounded-sm ">
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
            {filterdAccessPoints.length === 0 && <div>No results.</div>}
            {isLoadingAccessPoints ? (
              <div className="flex justify-center">
                <Spinner color="black" size="40" />
              </div>
            ) : (
              filterdAccessPoints?.map((item) => (
                <div
                  onClick={() => handleSelect(item)}
                  key={item.access_point_id}
                  className="flex justify-between px-2 items-center hover:bg-light-200 cursor-pointer border rounded"
                >
                  <p className="text-sm">
                    {item.element_name.slice(0, 23)}
                    {item.element_name.slice(0, 23).length === 23 && "..."}
                  </p>
                  {selectedItem?.some(
                    (selected) =>
                      selected.access_point_id === item.access_point_id
                  ) ? (
                    <Check size={14} color="#038C5A" />
                  ) : null}
                </div>
              ))
            )}
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={selectedAccessEntitlementElements?.length === 0}
                  >
                    Remove
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRemoveAccessEntitlementElements}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          </div>
        </div>
        {/* w-[calc(100%-11rem)] */}
        <div className="w-[calc(100%-11rem)] relative scrollbar-thin border rounded-sm p-3 overflow-y-scroll">
          <div className="rounded-sm h-[10rem] scrollbar-thin flex flex-wrap gap-1 justify-end">
            <p className="text-sm absolute left-0 top-0 p-1">
              {selectedItem.length}
            </p>
            {selectedItem?.map((rec) => (
              <div
                key={rec.access_point_id}
                className="flex gap-1 bg-winter-100 h-8 px-3 items-center rounded-full"
              >
                <p className="text-sm">{rec.element_name}</p>
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
