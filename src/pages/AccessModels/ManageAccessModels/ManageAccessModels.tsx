import { ring } from "ldrs";
import { ChevronDown, ChevronUp } from "lucide-react";
import SearchModels from "./SearchModels/SearchModels";
import SearchResults from "./SearchResults/SearchResults";
import { useEffect, useState } from "react";
import { useAACContext } from "@/Context/ManageAccessEntitlements/AdvanceAccessControlsContext";

const ManageAccessModels = () => {
  const { fetchDataSource } = useAACContext();
  const [isSearchModelsOpen, setIsSearchModelsOpen] = useState(true);
  const [isSearchResultsOpen, setIsSearchResultsOpen] = useState(true);
  useEffect(() => {
    fetchDataSource();
  }, []);

  ring.register();
  return (
    <div className="bg-slate-100 p-2">
      <div className="flex gap-2 items-center p-2">
        {isSearchModelsOpen ? (
          <ChevronUp
            onClick={() => setIsSearchModelsOpen(!isSearchModelsOpen)}
            className="border bg-white rounded cursor-pointer"
          />
        ) : (
          <ChevronDown
            onClick={() => setIsSearchModelsOpen(!isSearchModelsOpen)}
            className="border bg-white rounded cursor-pointer"
          />
        )}

        <h4>Search Models</h4>
      </div>
      <div className=" ">{isSearchModelsOpen && <SearchModels />}</div>
      <div className="my-4">
        <h4 className="font-semibold ml-2">Manage Models</h4>
        <div className="p-2 border rounded-md bg-white">
          <div className="flex gap-2 items-center my-1">
            {isSearchResultsOpen ? (
              <ChevronUp
                onClick={() => setIsSearchResultsOpen(!isSearchResultsOpen)}
                className="border bg-slate-100 rounded cursor-pointer"
              />
            ) : (
              <ChevronDown
                onClick={() => setIsSearchResultsOpen(!isSearchResultsOpen)}
                className="border bg-slate-100 rounded cursor-pointer"
              />
            )}
            <h4>Search Results</h4>
          </div>
          {isSearchResultsOpen && <SearchResults />}
        </div>
      </div>
    </div>
  );
};
export default ManageAccessModels;
