import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Post = () => {
  const [post, setPost] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      const response = await axios.get(`https://dummyjson.com/posts/${id}`);
      setPost(response.data);
    };

    fetchPost();
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <div className="border p-4 rounded-md">
          <h2 className="font-bold mb-2">{post.title}</h2>
          <p>{post.body}</p>
        </div>
      </div>
    </>
  );
};

export default Post;
