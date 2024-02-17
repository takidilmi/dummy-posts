import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useDebounce from './useDebounce';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const [deletePostId, setDeletePostId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/posts');
        setPosts(response.data.posts);
        if (debouncedSearchTerm) {
          setPosts(
            posts.filter((post) =>
              post.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            )
          );
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [debouncedSearchTerm]);

  const handleDelete = (id) => {
    setDeletePostId(id);
  };

  if (!posts) {
    return <div>No posts found</div>;
  }

  return (
    <>
      <Dialog
        open={deletePostId !== null}
        onClose={() => setDeletePostId(null)}
      >
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletePostId(null)}>Cancel</Button>
          <Button
            onClick={() => {
              setPosts(posts.filter((post) => post.id !== deletePostId));
              setDeletePostId(null);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <div className="flex flex-col text-justify justify-center p-5 items-center">
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
              className="border flex flex-col justify-between p-4 rounded-md gap-5"
              key={post.id}
            >
              <Link to={`/posts/${post.id}`}>
                <h2 className="font-bold mb-2">{post.title}</h2>
                <p className='h-[150px] pr-2 overflow-y-scroll'>{post.body}</p>
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
                <button className='bg-red-200 rounded px-2 py-1 text-sm' onClick={() => handleDelete(post.id)}>Delete Post</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Posts;
