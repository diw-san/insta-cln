import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { IoIosCloseCircle } from "react-icons/io";

export default function Search({ setOnSearch }) {
  const [searchList, setSearchList] = useState([]);
  const [newSearch, setNewSearch] = useState("");

  function handleSearchSubmit(event) {
    if (event.key === "Enter" && newSearch.trim() !== "") {
      const updatedSearch = [...searchList, newSearch];
      setSearchList(updatedSearch);

      // Update localStorage with the updated history
      localStorage.setItem("searchHistory", JSON.stringify(updatedSearch));
      setNewSearch("");
    }
  }

  useEffect(() => {
    // Retrieve search history from localStorage when component mounts
    const storedSearch = localStorage.getItem("searchHistory");
    if (storedSearch) {
      setSearchList(JSON.parse(storedSearch));
    }
  }, []);

  function handleRemoveRecent(currentIndex) {
    const updatedSearch = searchList.filter(
      (_, index) => index !== currentIndex
    );
    setSearchList(updatedSearch);
    // Update localStorage
    localStorage.setItem("searchHistory", JSON.stringify(updatedSearch));
  }

  return (
    <>
      <div className="bg-zinc-800 w-[20rem] pt-3 top-0 h-[100vh] text-zinc-200 rounded-xl">
        <div className="">
          <span className="flex justify-between text-xl ml-4">
            Search
            <CgClose
              size={24}
              className="mr-2 cursor-pointer"
              onClick={() => setOnSearch(false)}
            />
          </span>
          <div className="flex mt-6 mx-4 h-[2.3rem] w-[18rem] items-center bg-zinc-300/65 p-[15px] mr-[9px] rounded-lg">
            <BiSearch className="text-zinc-500 mr-[3px]" size={20} />
            <input
              type="text"
              className=" bg-transparent ml-2 focus:outline-none text-zinc-500"
              placeholder="Search"
              value={newSearch}
              onChange={(e) => setNewSearch(e.target.value)}
              onKeyDown={handleSearchSubmit}
            />
          </div>
        </div>

        <hr className="mt-7 w-full " />

        <span className="text-xl ml-4">Recent</span>
        <div className="mt-4">
          {searchList.map((searchItem, index) => (
            <div key={index} className="flex justify-between ml-4 mr-2">
              <span>{searchItem}</span>
              <IoIosCloseCircle
                className="cursor-pointer text-zinc-500"
                onClick={() => handleRemoveRecent(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
