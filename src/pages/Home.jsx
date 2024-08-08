import React, { useEffect, useState } from "react";
import Posts from "../components/Post/Posts";
import Suggestions from "../components/Suggestions";
import Stories from "../components/Stories";

export default function Home() {
  return (
    <>
      <div className="flex justify-center md:ml-[5rem] md:mr-[2rem] lg:ml-[15rem] lg:mr-[5rem]">
        <div className="p-2 mx-auto min-w-[470px] md:min-w-[600px] xl:flex-[2] ">
          {/* Stories */}
          <div className="">
            <Stories />
          </div>

          {/* Posts */}
          <div className="mt-6">
            <Posts />
          </div>
        </div>

        <div className="hidden p-2 xl:block xl:flex-[1] xl:shadow-md ml-2">
          {/* Suggestions */}

          <Suggestions />
        </div>
      </div>
    </>
  );
}
