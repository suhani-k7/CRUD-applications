import { useState,useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Create from "./components/Create";
import BlogDetails from "./components/BlogDetails";
import NotFound from "./components/NotFound";
import LoginSignup from "./components/LoginSignup";
import blogService from "./services/blogs"

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  return (
    <Router>
      <div className="App">
        <Navbar  user={user} setUser={setUser}/>
        <div className="content">
          <Routes>
            {!user ? (
              <>
                <Route path="*" element={<LoginSignup setUser={setUser} user={user}/>} />
              </>
            ) : (
              <>
                <Route path="/" element={<Home user={user}/>} />
                <Route path="/create" element={<Create user={user} />} />
                <Route path="/blogs/:id" element={<BlogDetails />} />
                <Route path="*" element={<NotFound />} />
              </>)}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;