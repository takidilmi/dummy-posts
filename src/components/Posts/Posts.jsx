import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useDebounce from './useDebounce';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get('https://dummyjson.com/posts');
      setPosts(response.data.posts);
      if (debouncedSearchTerm) {
        setPosts(
          posts.filter((post) =>
            post.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          )
        );
      }
    };
    fetchPosts();
  }, [debouncedSearchTerm]);

  return (
    <>
      <div className='flex flex-col justify-center p-5 items-center'>
        <Autocomplete
          freeSolo
          options={posts.map((post) => post.title)}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search posts"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
        />
        <div className="grid p-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              className="border flex flex-col justify-between p-4 rounded-md"
              key={post.id}
            >
              <Link to={`/posts/${post.id}`}>
                <h2 className="font-bold mb-2">{post.title}</h2>
                <p>{post.body}</p>
              </Link>
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
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Posts;
