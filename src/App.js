import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Home from "./components/pages/Home";
import Login from "./components/pages/Auth/Login";
import Register from "./components/pages/Auth/Register";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Container from "./components/layout/Container";
import { UserProvider } from "./context/UserContext";
import Message from "./components/layout/Message";
function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Message />
        <Container>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* <Route path="/users" element={<Users />} /> */}
            <Route path="/allusers" element={<Navigate to="/users" />} />
            {/* <Route path="/contact" element={<Contact />} /> */}
          </Routes>
        </Container>

        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
