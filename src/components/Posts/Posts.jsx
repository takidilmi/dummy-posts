import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get('https://dummyjson.com/posts');
      setPosts(response.data.posts);
    };

    fetchPosts();
  }, []);

  return (
    <>
      <div className="grid p-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link
            className="border flex flex-col justify-between p-4 rounded-md"
            to={{ pathname: `/posts/${post.id}`, state: { post } }}
            key={post.id}
          >
            <div>
              <h2 className="font-bold mb-2">{post.title}</h2>
              <p>{post.body}</p>
            </div>
            <div className="flex flex-wrap flex-row justify-between items-center">
              <p>
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="mr-2 bg-gray-200 rounded px-2 py-1 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </p>
              <p>Reactions: {post.reactions}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Posts;
