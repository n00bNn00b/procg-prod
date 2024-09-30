import { ring } from "ldrs";
import { ChevronDown, ChevronUp } from "lucide-react";
import SearchModels from "./SearchModels/SearchModels";
import SearchResults from "./SearchResults/SearchResults";
import { useState } from "react";

const ManageAccessModels = () => {
  const [isSearchModelsOpen, setIsSearchModelsOpen] = useState(false);
  const [isSearchResultsOpen, setIsSearchResultsOpen] = useState(false);
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

        <h4>Serach Models</h4>
      </div>
      <div className="grid grid-cols-2">
        {isSearchModelsOpen && <SearchModels />}

        <div></div>
      </div>
      <div className="my-4">
        <h4 className="font-semibold ml-2">Manage Models</h4>
        <div className="p-2 border rounded-md bg-white">
          <div className="flex gap-2 items-center my-1">
            {isSearchModelsOpen ? (
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
            <h4>Serach Results</h4>
          </div>
          {isSearchResultsOpen && <SearchResults />}
        </div>
      </div>
    </div>
  );
};
export default ManageAccessModels;
