import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';

const Post = () => {
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPostAndUser = async () => {
      const postResponse = await axios.get(`https://dummyjson.com/posts/${id}`);
      const localStorageReactions = localStorage.getItem(
        `post-${id}-reactions`
      );
      const reactions = localStorageReactions
        ? Number(localStorageReactions)
        : postResponse.data.reactions;
      setPost({ ...postResponse.data, reactions });

      const userResponse = await axios.get(
        `https://dummyjson.com/users/${postResponse.data.userId}`
      );
      setUser(userResponse.data);
    };

    fetchPostAndUser();
  }, [id]);

  const handleReact = () => {
    const newReactions = post.reactions + 1;
    localStorage.setItem(`post-${id}-reactions`, newReactions);
    setPost({ ...post, reactions: newReactions });
  };

  const handleDislike = () => {
    const newReactions = post.reactions > 0 ? post.reactions - 1 : 0;
    localStorage.setItem(`post-${id}-reactions`, newReactions);
    setPost({ ...post, reactions: newReactions });
  };

  if (!post || !user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="flex flex-col w-1/2 border p-4 rounded-md justify-between gap-10">
          <div className="flex flex-col gap-14">
            <div>
              <h2 className="font-bold mb-2">{post.title}</h2>
              <p>{post.body}</p>
            </div>
            <h2>
              <span>Author:</span> {user.firstName} {user.lastName}
            </h2>
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
            <div className="flex flex-col items-center justify-center">
              <p>Reactions: {post.reactions}</p>
              <div className='flex gap-5 items-center justify-center'>
                <ThumbUpAltIcon cursor="pointer" onClick={handleReact} />
                <ThumbDownAltIcon cursor="pointer" onClick={handleDislike} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        h2 span {
          font-weight: 700;
        }
      `}</style>
    </>
  );
};

export default Post;
