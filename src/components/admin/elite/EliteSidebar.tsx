import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Users, 
  UserCog, 
  Shield, 
  ClipboardList, 
  Download 
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/elite" },
  { icon: Calendar, label: "Events", path: "/admin/elite/events" },
  { icon: FileText, label: "Registrations", path: "/admin/elite/registrations" },
  { icon: Users, label: "Chapter Admins", path: "/admin/elite/chapter-admins" },
  { icon: UserCog, label: "Super Admins", path: "/admin/elite/super-admins" },
  { icon: Shield, label: "Role Management", path: "/admin/elite/roles" },
  { icon: ClipboardList, label: "Audit Logs", path: "/admin/elite/audit" },
  { icon: Download, label: "Reports & Exports", path: "/admin/elite/reports" },
];

export default function EliteSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-border">
        <h1 className="text-xl font-bold text-primary">IEEE DAY 2025</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/admin/elite"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Elite Master Panel
        </p>
      </div>
    </aside>
  );
}
