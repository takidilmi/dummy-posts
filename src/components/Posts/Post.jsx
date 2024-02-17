import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';

const Post = () => {
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const [suggestedPosts, setSuggestedPosts] = useState([]);

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

      const allPostsResponse = await axios.get('https://dummyjson.com/posts');
      setSuggestedPosts(
        allPostsResponse.data.posts.filter(
          (p) => p.tags.includes(postResponse.data.tags[0]) && p.id !== id
        )
      );
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
        <div className="flex flex-col sm:w-1/2 w-[80%] border p-4 rounded-md justify-between gap-10">
          <div className="flex flex-col gap-14">
            <div>
              <h2 className="font-bold mb-2">{post.title}</h2>
              <p>{post.body}</p>
            </div>
            <h3>
              <span>Author:</span> {user.firstName} {user.lastName}
            </h3>
          </div>
          <div className="flex flex-wrap flex-row justify-between items-center">
            <p className='flex flex-wrap justify-between'>
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
              <div className="flex gap-5 items-center justify-center">
                <ThumbUpAltIcon
                  cursor="pointer"
                  onClick={handleReact}
                />
                <ThumbDownAltIcon
                  cursor="pointer"
                  onClick={handleDislike}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-4 justify-center items-center">
        <h2>Suggested Posts</h2>
        <div className="flex p-2 flex-wrap flex-row border rounded-md justify-between gap-4">
          {suggestedPosts.map((post) => (
            <Link
              className="flex flex-col justify-between border p-2 text-wrap h-[100px] w-[300px]"
              to={`/posts/${post.id}`}
              key={post.id}
            >
              <h2>{post.title}</h2>
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
            </Link>
          ))}
        </div>
      </div>
      <style jsx>{`
        h3 span, h2 {
          text-align: center;
          font-weight: 700;
        }
      `}</style>
    </>
  );
};

export default Post;
