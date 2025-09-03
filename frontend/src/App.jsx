import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
import Stores from './pages/Stores.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import OwnerDashboard from './pages/OwnerDashboard.jsx'
import Nav from './components/Nav.jsx'
import AdminUsers from './pages/AdminUsers.jsx'
import AdminStores from './pages/AdminStores.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import RequireRole from './components/RequireRole.jsx'
import AdminCreateUser from './pages/AdminCreateUser.jsx'
import AdminCreateStore from './pages/AdminCreateStore.jsx'

function Home() {
  return (
    <div className="container">
      <div className="card">
        <h1>Store Ratings</h1>
        <p>Frontend scaffold ready.</p>
        <Link className="btn" to="/login">Login</Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/change-password" element={<RequireAuth><ChangePassword /></RequireAuth>} />
        <Route path="/stores" element={<RequireAuth><Stores /></RequireAuth>} />
        <Route path="/admin" element={<RequireRole roles={["ADMIN"]}><AdminDashboard /></RequireRole>} />
        <Route path="/admin/users" element={<RequireRole roles={["ADMIN"]}><AdminUsers /></RequireRole>} />
        <Route path="/admin/users/create" element={<RequireRole roles={["ADMIN"]}><AdminCreateUser /></RequireRole>} />
        <Route path="/admin/stores" element={<RequireRole roles={["ADMIN"]}><AdminStores /></RequireRole>} />
        <Route path="/admin/stores/create" element={<RequireRole roles={["ADMIN"]}><AdminCreateStore /></RequireRole>} />
        <Route path="/owner" element={<RequireRole roles={["OWNER"]}><OwnerDashboard /></RequireRole>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
