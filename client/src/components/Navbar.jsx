import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { instance as axios } from "../utils/axios";
import useAuthCheck from "../hooks/useAuthCheck";
import { MdPerson, MdMenu, MdClose } from "react-icons/md";

const Navbar = () => {
  const { auth, loading } = useAuthCheck();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await axios.post("/auth/logout", {}, { withCredentials: true }).catch(() => {});
    navigate("/login");
    window.location.reload();
  };

  // Nav links as a component for reuse
  const NavLinks = () => (
    <>
      <Link to="/" className="block px-2 py-1 text-white hover:text-amber-300 font-medium" onClick={() => setMenuOpen(false)}>
        Home
      </Link>
      <Link to="/createpost" className="block px-2 py-1 text-white hover:text-amber-300 font-medium" onClick={() => setMenuOpen(false)}>
        Create Post
      </Link>
      {!loading && auth && (
        <button
          onClick={() => { setMenuOpen(false); navigate('/profile'); }}
          className="px-2 py-1 text-white hover:text-amber-300 font-medium bg-transparent border-none cursor-pointer flex items-center"
          title="My Profile"
          aria-label="My Profile"
        >
          <MdPerson size={24} className="mr-1" />
          <span className="hidden md:inline">Profile</span>
        </button>
      )}
      {!loading && !auth && (
        <>
          <Link to="/login" className="block px-2 py-1 text-white hover:text-amber-300 font-medium" onClick={() => setMenuOpen(false)}>
            Login
          </Link>
          <Link to="/register" className="block px-2 py-1 text-white hover:text-amber-300 font-medium" onClick={() => setMenuOpen(false)}>
            Register
          </Link>
        </>
      )}
      {!loading && auth && (
        <button
          onClick={() => { setMenuOpen(false); handleLogout(); }}
          className="block px-2 py-1 text-white hover:text-amber-300 font-medium bg-transparent border-none cursor-pointer"
        >
          Logout
        </button>
      )}
    </>
  );

  return (
    <nav className="bg-gray-800 p-4 flex items-center justify-between relative">
      <div className="flex items-center gap-4">
        <h1 className="text-white font-bold text-xl">Poster</h1>
        {/* Desktop nav links */}
        <div className="hidden md:flex gap-4 ml-8">
          <NavLinks />
        </div>
      </div>
      {/* Hamburger menu button for mobile */}
      <button
        className="md:hidden text-white focus:outline-none z-20"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
      </button>
      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-800 shadow-lg flex flex-col md:hidden z-10 animate-fade-in">
          <NavLinks />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
