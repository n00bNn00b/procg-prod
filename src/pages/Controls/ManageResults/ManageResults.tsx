import { ring } from "ldrs";
import { ChevronDown, ChevronUp } from "lucide-react";
import SearchModels from "./SearchResults/SearchModels";
import SearchResults from "./SearchResultsIncidents/SearchResults";
import { useState } from "react";

const ManageResults = () => {
  const [isSearchModelsOpen, setIsSearchModelsOpen] = useState(true);
  const [isSearchResultsOpen, setIsSearchResultsOpen] = useState(true);

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

        <h4>Search Results</h4>
      </div>
      <div className=" ">{isSearchModelsOpen && <SearchModels />}</div>
      <div className="my-4">
        <h4 className="font-semibold ml-2">Manage Models</h4>
        <div className="p-2 border rounded-md bg-white  ">
          <div className="flex gap-2 items-center my-1 ">
            {/* bg-gradient-to-t from-slate-50 to-slate-400 */}
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
            <h4>Search Results : Incidents</h4>
          </div>
          {isSearchResultsOpen && <SearchResults />}
        </div>
      </div>
    </div>
  );
};
export default ManageResults;
