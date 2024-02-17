import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Posts from './components/Posts/Posts';
import Post from './components/Posts/Post';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/posts" />}
        />
        <Route
          path="/posts"
          element={<Posts />}
        />
        <Route
          path="/posts/:id"
          element={<Post />}
        />
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </Router>
  );
}

export default App;
