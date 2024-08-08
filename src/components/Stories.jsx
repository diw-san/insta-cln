import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { faker } from "@faker-js/faker";

export default function Stories() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const stories = [...Array(20)].map((_, i) => ({
      id: i,
      image: i === 0 ? auth.currentUser.photoURL : faker.image?.avatar(),
      username: i === 0 ? "You" : faker.person.fullName(),
    }));
    setUsers(stories);
  }, []);

  return (
    <>
      <div className="flex gap-[6px] overflow-x-scroll scroll-smooth hideCommentsScroll">
        {users?.map((user) => (
          <div key={user.id} className="p-1">
            <div className="rounded-full w-[55px] h-[55px] border-[2px] border-pink-500 p-[2px] hover:scale-110 transition-all ease-out">
              <img
                src={user.image}
                alt=""
                className="object-cover w-full h-full rounded-full "
              />
            </div>
            <p className="w-[52px] text-center text-[11px] truncate">
              {user.username}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
