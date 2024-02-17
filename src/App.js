import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Posts from './components/Posts/Posts';
import Post from './components/Posts/Post';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/posts"
          element={<Posts />}
        />
        <Route
          path="/posts/:id"
          element={<Post />}
        />
      </Routes>
    </Router>
  );
}

export default App;
