import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import NotFound from '../NotFound';

const Post = () => {
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const [suggestedPosts, setSuggestedPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostAndUser = async () => {
      try {
        const postResponse = await axios.get(
          `https://dummyjson.com/posts/${id}`
        );
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
            (p) =>
              p.tags.includes(postResponse.data.tags[0]) && p.id !== Number(id)
          )
        );
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError('Post not found');
        } else {
          setError('An error occurred');
        }
      }
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
  if (error) {
    return <NotFound />;
  }
  if (!post || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-32 h-32 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="relative flex flex-col justify-between h-screen p-10">
        <Link to={'/posts'} className='absolute text-blue-600 hover:scale-90 top-5 left-5'>Go Home</Link>
        <div className="flex items-center justify-center text-justify">
          <div className="flex flex-col sm:w-1/2 w-[80%] border p-4 rounded-md justify-between gap-10">
            <div className="flex flex-col gap-14">
              <div>
                <h2 className="mb-2 font-bold">{post.title}</h2>
                <p>{post.body}</p>
              </div>
              <h3>
                <span>Author:</span> {user.firstName} {user.lastName}
              </h3>
            </div>
            <div className="flex flex-row flex-wrap items-center justify-between">
              <p className="flex flex-wrap justify-between">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 mr-2 text-sm bg-gray-200 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </p>
              <div className="flex flex-col items-center justify-center">
                <p>Reactions: {post.reactions}</p>
                <div className="flex items-center justify-center gap-5">
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
        <div className="flex flex-col items-center justify-center p-4">
          <h2>Suggested Posts</h2>
          <div className="flex flex-row flex-wrap justify-center gap-4 p-2 border rounded-md">
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
                      className="px-2 py-1 mr-2 text-sm bg-gray-200 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        h3 span,
        h2 {
          text-align: center;
          font-weight: 700;
        }
      `}</style>
    </>
  );
};

export default Post;
