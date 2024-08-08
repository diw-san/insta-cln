import React, { useEffect, useState } from "react";
import Post from "./Post";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setPosts(snapshot.docs);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db]);

  //console.log("posts_", posts);
  return (
    <>
      <p className="text-sky-700 flex justify-center">
        {loading && "Loading..."}
      </p>
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <Post
              id={post.id}
              image={post.data().image}
              caption={post.data().caption}
              profileImg={post.data().profileImg}
              username={post.data().username}
              time={post.data().timestamp?.toMillis()}
              imageAlt={post.data().imageAlt}
            />
          </div>
        );
      })}
    </>
  );
}
