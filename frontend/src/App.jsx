import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Singup" 
import Following from "./pages/Following";
import Profile from "./pages/Profile";
import CreateVideo from "./pages/CreateVideo"
import Search from "./pages/Search"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/following" element={<Following />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/:userId" element={<Profile />} />
      <Route path="/create-video" element={<CreateVideo />} />
      <Route path="/search" element={<Search />} />
    </Routes>
  );
}

export default App;