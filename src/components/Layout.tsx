import { NavLink, useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import {
  LayoutDashboard,
  Leaf,
  CloudSun,
  TrendingUp,
  ShieldCheck,
  BookOpen,
  Info,
  LogOut,
  Sprout,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/crop-health", label: "Crop Health", icon: Leaf },
  { to: "/weather", label: "Weather", icon: CloudSun },
  { to: "/market", label: "Market Prices", icon: TrendingUp },
  { to: "/passport", label: "Context Passport", icon: ShieldCheck },
  { to: "/field-memory", label: "Field Memory", icon: BookOpen },
  { to: "/about", label: "About", icon: Info },
];

const mobileNavItems = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/crop-health", label: "Crop", icon: Leaf },
  { to: "/weather", label: "Weather", icon: CloudSun },
  { to: "/market", label: "Market", icon: TrendingUp },
  { to: "/field-memory", label: "Memory", icon: BookOpen },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50/40 via-white to-sky-50/40">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r border-gray-100 bg-white/60 backdrop-blur-xl lg:flex flex-col">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/30">
            <Sprout className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900">FarmSaarthi</p>
            <p className="text-[11px] text-gray-400">BRICS Agri Intelligence</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-100 p-3">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                isActive ? "bg-brand-50 text-brand-700" : "text-gray-500 hover:bg-gray-50"
              }`
            }
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-bold">
              {(user?.email ?? "U")[0].toUpperCase()}
            </div>
            <span className="truncate">{user?.email ?? "Profile"}</span>
          </NavLink>
          <button
            onClick={handleSignOut}
            className="mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-gray-500 transition-all hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white/70 backdrop-blur-xl px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700">
            <Sprout className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">FarmSaarthi</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          <span className="text-[10px] font-semibold text-amber-700">Prototype</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-5xl px-4 pb-28 pt-4 lg:px-8 lg:pb-8 lg:pt-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-100 bg-white/80 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-around px-2 py-1.5 pb-[env(safe-area-inset-bottom)]">
          {mobileNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-all ${
                  isActive ? "text-brand-600" : "text-gray-400"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
