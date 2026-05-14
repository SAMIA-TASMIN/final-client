import { Sun, Moon } from "lucide-react";

const ThemeToggle = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    const newTheme = theme === "civicLight" ? "civicDark" : "civicLight";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme); // trigger Navbar re-render
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-base-200 text-base-content transition"
    >
      {theme === "civicLight" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
};

export default ThemeToggle;
