import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { faker } from "@faker-js/faker";
import { MdVerified } from "react-icons/md";

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);

  async function handdleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const person = [...Array(5)].map((_, i) => ({
      id: i,
      image: faker.image.url(),
      username: faker.person.fullName(),
      city: faker.location.city(),
    }));
    setSuggestions(person);
  }, []);
  //console.log(suggestions);

  return (
    <div className="">
      <div className="">
        <div className="flex justify-between items-center mt-2 ml-2">
          <img
            src={auth.currentUser.photoURL}
            alt="user"
            className="w-[50px] h-[50px] rounded-full border-2 "
          />

          <div>
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-medium">
                {auth.currentUser.displayName}
              </p>
              <MdVerified color="blue" size={12.5} />
            </div>

            <span className="flex text-gray-500 items-center text-[14px]">
              Welcome to instagram
            </span>
          </div>
          <p
            onClick={handdleLogout}
            className="text-blue-600 text-[14px] font-medium hover:text-blue-500 cursor-pointer"
          >
            Sign Out
          </p>
        </div>
      </div>
      <div className="mt-5">
        {suggestions.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center mt-2 ml-2"
          >
            <img
              src={item.image}
              alt="user"
              className="w-[50px] h-[50px] rounded-full border-2 "
            />
            <div className="flex flex-col items-end">
              <p className="text-[14px] font-medium">{item.username}</p>
              <span className="flex text-gray-500 items-center text-[14px]">
                from {item.city}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
