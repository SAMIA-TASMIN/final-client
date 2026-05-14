import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { AuthContext } from "../../Contexts/AuthContext";
import { Sun, Moon } from "lucide-react";

const Navbar = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "civicLight"
  );
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, logOut } = useContext(AuthContext);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const current = localStorage.getItem("theme") || "civicLight";
    const newTheme = current === "civicLight" ? "civicDark" : "civicLight";

    localStorage.setItem("theme", newTheme);

    // 🚀 Tell RootLayout to reload
    window.dispatchEvent(new Event("theme-change-reload"));
  };

  const handleLogout = () => {
    logOut();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  // ⚡ manual class switching
  const navBgClass =
    theme === "civicLight"
      ? "bg-white border-gray-200"
      : "bg-gray-900 border-gray-700";
  const textClass = theme === "civicLight" ? "text-gray-800" : "text-gray-100";
  const btnBgClass =
    theme === "civicLight"
      ? "bg-blue-600 text-white"
      : "bg-blue-500 text-gray-100";
  const hoverBtnClass =
    theme === "civicLight" ? "hover:bg-blue-500" : "hover:bg-blue-400";
  const dropdownBgClass =
    theme === "civicLight"
      ? "bg-white border-gray-200"
      : "bg-gray-800 border-gray-700";

  return (
    <nav className={`fixed top-0 w-full z-50 border-b shadow-sm ${navBgClass}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img className="h-10 w-10 object-contain" src={logo} alt="logo" />
            <span className={`text-xl font-semibold ${textClass}`}>
              CivicConnect
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" textClass={textClass}>
              Home
            </NavLink>
            <NavLink to="/all-issues" textClass={textClass}>
              All Issues
            </NavLink>
            <NavLink to="/my-issues" textClass={textClass}>
              My Issues
            </NavLink>
            <NavLink to="/coverage" textClass={textClass}>
              Coverage
            </NavLink>

            <Link
              to="/be_a_staff"
              className={`px-4 py-2 rounded-xl transition ${btnBgClass} ${hoverBtnClass}`}
            >
              Be a Staff
            </Link>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition ${btnBgClass}`}
            >
              {theme === "civicLight" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center focus:outline-none"
                >
                  <img
                    src={user?.photoURL || "https://i.ibb.co/ZmFHZDM/user.png"}
                    alt="profile"
                    className="h-9 w-9 rounded-full border object-cover"
                  />
                </button>

                {isProfileDropdownOpen && (
                  <div
                    className={`absolute right-0 mt-3 w-48 rounded-xl shadow-md overflow-hidden border ${dropdownBgClass}`}
                  >
                    <div
                      className="px-4 py-3 border-b"
                      style={{
                        borderColor:
                          theme === "civicLight" ? "#E5E7EB" : "#374151",
                      }}
                    >
                      <p className={`text-sm font-medium ${textClass}`}>
                        {user.displayName}
                      </p>
                    </div>
                    <DropdownLink to="/dashboard" textClass={textClass}>
                      Dashboard
                    </DropdownLink>
                    <DropdownLink to="/profile" textClass={textClass}>
                      My Profile
                    </DropdownLink>
                    <DropdownLink to="/be_a_staff" textClass={textClass}>
                      Be a Staff
                    </DropdownLink>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-blue-700 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`px-4 py-2 rounded-xl transition ${btnBgClass} ${hoverBtnClass}`}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className={textClass + " md:hidden"}
          >
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden border-t ${dropdownBgClass}`}>
          <MobileLink to="/" textClass={textClass} onClick={setMobileMenuOpen}>
            Home
          </MobileLink>
          <MobileLink
            to="/all-issues"
            textClass={textClass}
            onClick={setMobileMenuOpen}
          >
            All Issues
          </MobileLink>
          <MobileLink
            to="/my-issues"
            textClass={textClass}
            onClick={setMobileMenuOpen}
          >
            My Issues
          </MobileLink>
          <MobileLink
            to="/coverage"
            textClass={textClass}
            onClick={setMobileMenuOpen}
          >
            Coverage
          </MobileLink>

          {user ? (
            <div
              className="border-t mt-2"
              style={{
                borderColor: theme === "civicLight" ? "#E5E7EB" : "#374151",
              }}
            >
              <p className={`px-4 py-2 text-sm font-medium ${textClass}`}>
                {user.displayName}
              </p>
              <MobileLink
                to="/dashboard"
                textClass={textClass}
                onClick={setMobileMenuOpen}
              >
                Dashboard
              </MobileLink>
              <MobileLink
                to="/profile"
                textClass={textClass}
                onClick={setMobileMenuOpen}
              >
                My Profile
              </MobileLink>
              <MobileLink
                to="/be_a_staff"
                textClass={textClass}
                onClick={setMobileMenuOpen}
              >
                Be a Staff
              </MobileLink>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-blue-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <MobileLink
              to="/login"
              textClass={textClass}
              onClick={setMobileMenuOpen}
            >
              Login
            </MobileLink>
          )}
        </div>
      )}
    </nav>
  );
};

// Reusable links
const NavLink = ({ to, children, textClass }) => (
  <Link
    to={to}
    className={`text-sm font-medium transition ${textClass} hover:text-blue-500`}
  >
    {children}
  </Link>
);

const DropdownLink = ({ to, children, textClass }) => (
  <Link
    to={to}
    className={`block px-4 py-2 text-sm transition ${textClass} hover:bg-blue-700`}
  >
    {children}
  </Link>
);

const MobileLink = ({ to, children, textClass, onClick }) => (
  <Link
    to={to}
    onClick={() => onClick(false)}
    className={`block px-4 py-2 text-sm transition ${textClass} hover:bg-blue-700`}
  >
    {children}
  </Link>
);

export default Navbar;
