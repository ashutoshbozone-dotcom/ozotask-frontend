import { useState, useEffect, useRef } from "react";

const API_URL   = (import.meta.env.VITE_API_BASE_URL || "https://taskflow-backend-production-1430.up.railway.app").replace(/\/$/, "");
const ADMIN_KEY = "OzoAdmin@2026";
import {
  LayoutDashboard, CheckSquare, FolderOpen, Users, Bell,
  LogOut, Plus, Search, Calendar, Clock, MessageCircle,
  Mail, CheckCircle2, X, Columns, List, MoreHorizontal,
  TrendingUp, Filter, Send, AlertTriangle, ChevronRight,
  Menu, Zap, User, Hash, ArrowUpRight, RefreshCw, Eye,
  Phone, ChevronDown, Trash2, Edit3, Circle, Star,
  AlertCircle, Check, Settings, Tag, Briefcase, Shield
} from "lucide-react";

const ADMIN_USER = {
  id: 1, name: "Admin", initials: "AD", role: "owner",
  email: "@admin", password: "Admin@task",
  phone: "", color: "bg-purple-500",
  team: "Leadership", designation: "Owner & Admin",
};

const USER_COLORS = ["bg-purple-500","bg-blue-500","bg-pink-500","bg-green-500","bg-orange-500","bg-teal-500","bg-red-500","bg-indigo-500","bg-cyan-500","bg-amber-500"];
const DEFAULT_TEAMS = ["Leadership","Engineering","Marketing","Design","Sales","Operations","HR","Finance"];
const DEFAULT_ROLES = ["manager","employee"];
const DEFAULT_DESIGNATIONS = ["Owner & Admin","General Manager","Project Manager","Team Lead","Senior Engineer","Engineer","Designer","Marketing Manager","Marketing Executive","HR Manager","HR Executive","Sales Manager","Sales Executive","Operations Manager","Operations Executive","Analyst","Intern","Other"];

const PROJECTS_INIT = [
  { id: 1, name: "Website Redesign",       color: "bg-blue-500",   emoji: "🌐", description: "Complete overhaul of company website",           deadline: "2026-04-15", owner: 1, members: [1,2,3,5] },
  { id: 2, name: "Q2 Marketing Campaign",  color: "bg-green-500",  emoji: "📣", description: "Launch Q2 digital marketing push",              deadline: "2026-04-30", owner: 1, members: [1,4,6] },
  { id: 3, name: "Mobile App v2",          color: "bg-purple-500", emoji: "📱", description: "Release version 2.0 of the mobile app",         deadline: "2026-05-20", owner: 2, members: [2,3] },
  { id: 4, name: "HR Onboarding System",   color: "bg-orange-500", emoji: "👥", description: "Automate employee onboarding workflow",          deadline: "2026-06-01", owner: 1, members: [1,2,3,4,5,6] },
];

const TASKS_INIT = [
  { id:1,  title:"Design new homepage mockups",      description:"Create 3 homepage design variations for client review.",          projectId:1, assignees:[5,3], createdBy:1, status:"inprogress", priority:"high",   type:"collaborative", dueDate:"2026-03-20", createdAt:"2026-03-10", comments:[{userId:5,text:"Started working on the first variation",ts:"2026-03-11T10:00:00"}], autoFollowUp:true },
  { id:2,  title:"Set up Google Ads campaign",       description:"Configure and launch Q2 Google Ads for the campaign.",            projectId:2, assignees:[4],   createdBy:6, status:"todo",       priority:"urgent", type:"individual",    dueDate:"2026-03-18", createdAt:"2026-03-14", comments:[], autoFollowUp:true },
  { id:3,  title:"Fix login screen bug",             description:"Users reporting intermittent login failures on mobile.",          projectId:3, assignees:[3],   createdBy:2, status:"inprogress", priority:"urgent", type:"individual",    dueDate:"2026-03-17", createdAt:"2026-03-15", comments:[{userId:3,text:"Identified the issue, working on fix",ts:"2026-03-15T09:00:00"}], autoFollowUp:true },
  { id:4,  title:"Draft onboarding checklist",       description:"Create a comprehensive checklist for new employee onboarding.",   projectId:4, assignees:[2],   createdBy:1, status:"todo",       priority:"medium", type:"individual",    dueDate:"2026-03-25", createdAt:"2026-03-13", comments:[], autoFollowUp:true },
  { id:5,  title:"Review homepage copy",             description:"Proofread and approve all homepage content.",                    projectId:1, assignees:[1],   createdBy:2, status:"review",     priority:"medium", type:"individual",    dueDate:"2026-03-22", createdAt:"2026-03-12", comments:[], autoFollowUp:true },
  { id:6,  title:"Competitor analysis report",       description:"Research top 5 competitors and document findings.",              projectId:2, assignees:[4,6], createdBy:1, status:"done",       priority:"medium", type:"collaborative", dueDate:"2026-03-15", createdAt:"2026-03-10", comments:[{userId:4,text:"Report completed and uploaded",ts:"2026-03-15T14:00:00"}], autoFollowUp:false },
  { id:7,  title:"API integration for notifications",description:"Integrate email and WhatsApp notification APIs.",               projectId:3, assignees:[3,2], createdBy:2, status:"todo",       priority:"high",   type:"collaborative", dueDate:"2026-04-01", createdAt:"2026-03-16", comments:[], autoFollowUp:true },
  { id:8,  title:"Design employee onboarding portal",description:"UI/UX design for the HR onboarding portal.",                   projectId:4, assignees:[5],   createdBy:1, status:"inprogress", priority:"medium", type:"individual",    dueDate:"2026-03-28", createdAt:"2026-03-14", comments:[], autoFollowUp:true },
];

const NOTIFS_INIT = [
  { id:1, type:"email",    taskId:1, toUser:5,  subject:"New Task Assigned: Design new homepage mockups",    body:"Hi Neha, you've been assigned 'Design new homepage mockups' on Website Redesign. Due: Mar 20, 2026. Priority: High.",            ts:"2026-03-10T09:00:00", read:true,  direction:"sent" },
  { id:2, type:"whatsapp", taskId:2, toUser:4,  message:"📋 *New Task Assigned*\n\nHi Amit! You've been assigned:\n*Set up Google Ads campaign*\n📅 Due: Mar 18, 2026\n🔴 Priority: Urgent\n\nReply:\n✅ 'done' — mark complete\n▶️ 'start' — start working\n❓ 'help' — request help", ts:"2026-03-14T10:30:00", read:true,  direction:"sent",     status:"delivered" },
  { id:3, type:"email",    taskId:3, toUser:3,  subject:"🚨 Urgent Task: Fix login screen bug",               body:"Hi Priya, urgent task assigned: 'Fix login screen bug'. Due today. Please prioritize this immediately.",                      ts:"2026-03-15T08:00:00", read:false, direction:"sent" },
  { id:4, type:"whatsapp", taskId:3, toUser:3,  message:"🚨 *Urgent Task Alert*\n\nHi Priya! Urgent task:\n*Fix login screen bug*\n📅 Due: TODAY\n🔴 Priority: Urgent\n\nReply: 'done' | 'start' | 'help'", ts:"2026-03-15T08:05:00", read:false, direction:"sent",     status:"delivered" },
  { id:5, type:"whatsapp", taskId:3, fromUser:3,message:"Identified the issue, working on fix now 👍",        ts:"2026-03-15T09:15:00", read:true,  direction:"received" },
  { id:6, type:"email",    taskId:2, toUser:4,  subject:"⏰ Follow-up: Set up Google Ads campaign",           body:"Hi Amit, reminder: 'Set up Google Ads campaign' is due Mar 18, 2026. Current status: To Do. Please update your progress.",    ts:"2026-03-16T08:00:00", read:false, direction:"sent" },
];

const PRIORITY = {
  low:    { label:"Low",    dot:"bg-gray-400",   bg:"bg-gray-100",   text:"text-gray-600" },
  medium: { label:"Medium", dot:"bg-yellow-400", bg:"bg-yellow-50",  text:"text-yellow-700" },
  high:   { label:"High",   dot:"bg-orange-400", bg:"bg-orange-50",  text:"text-orange-700" },
  urgent: { label:"Urgent", dot:"bg-red-500",    bg:"bg-red-50",     text:"text-red-700" },
};
const STATUS = {
  todo:       { label:"To Do",       bg:"bg-gray-100",   text:"text-gray-600",   col:"border-gray-300" },
  inprogress: { label:"In Progress", bg:"bg-blue-50",    text:"text-blue-700",   col:"border-blue-400" },
  review:     { label:"In Review",   bg:"bg-purple-50",  text:"text-purple-700", col:"border-purple-400" },
  done:       { label:"Done",        bg:"bg-green-50",   text:"text-green-700",  col:"border-green-400" },
};
const fmtDate = d => new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
const fmtTime = ts => new Date(ts).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true});
const isOverdue = (due,status) => status !== "done" && new Date(due) < new Date();
const getUserById = (id, users) => users.find(u => u.id === id);

const Avatar = ({ user, size="md", className="" }) => {
  if (!user) return null;
  const s = { xs:"w-5 h-5 text-xs", sm:"w-7 h-7 text-xs", md:"w-8 h-8 text-sm", lg:"w-10 h-10 text-base", xl:"w-12 h-12 text-lg" };
  return (
    <div className={`${s[size]} ${user.color||"bg-gray-400"} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}>
      {user.initials}
    </div>
  );
};

const Chip = ({ children, className="" }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>{children}</span>
);
const PriorityChip = ({ priority }) => {
  const p = PRIORITY[priority] || PRIORITY.medium;
  return <Chip className={`${p.bg} ${p.text}`}><span className={`w-1.5 h-1.5 rounded-full ${p.dot}`}></span>{p.label}</Chip>;
};
const StatusChip = ({ status }) => {
  const s = STATUS[status] || STATUS.todo;
  return <Chip className={`${s.bg} ${s.text}`}>{s.label}</Chip>;
};
const Btn = ({ children, onClick, variant="primary", size="md", className="", disabled=false }) => {
  const variants = { primary:"bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm", secondary:"bg-white text-gray-700 border border-gray-200 hover:bg-gray-50", danger:"bg-red-600 text-white hover:bg-red-700", ghost:"text-gray-600 hover:bg-gray-100", success:"bg-green-600 text-white hover:bg-green-700" };
  const sizes = { sm:"px-3 py-1.5 text-xs", md:"px-4 py-2 text-sm", lg:"px-5 py-2.5 text-sm" };
  return <button onClick={onClick} disabled={disabled} className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-all ${variants[variant]} ${sizes[size]} ${disabled?"opacity-50 cursor-not-allowed":""} ${className}`}>{children}</button>;
};
const Modal = ({ open, onClose, title, children, width="max-w-lg" }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${width} max-h-[90vh] overflow-y-auto`} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><X size={16}/></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

const LoginPage = ({ onLogin, users, onSyncUsers }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch latest user list from backend and sync to localStorage
  const fetchBackendUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      if (!res.ok) return [];
      const backendUsers = await res.json();
      return backendUsers.map((u, i) => ({
        id: u._id,
        backendId: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        team: u.team || "General",
        phone: u.phone || "",
        designation: u.designation || "",
        reportsTo: u.reportsTo || "",
        initials: u.initials || u.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase(),
        color: ["bg-blue-500","bg-pink-500","bg-green-500","bg-orange-500","bg-teal-500","bg-indigo-500"][i % 6],
        password: null, // password not exposed from backend
      }));
    } catch { return []; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) { setError("Please enter your username and password."); return; }
    setLoading(true);
    const input = email.trim().toLowerCase();

    // Step 1: Check @admin locally
    if ((ADMIN_USER.email.toLowerCase() === input || ADMIN_USER.name.toLowerCase() === input) && ADMIN_USER.password === password) {
      // Sync all backend users to local storage when admin logs in
      const backendUsers = await fetchBackendUsers();
      if (backendUsers.length && onSyncUsers) onSyncUsers(backendUsers);
      localStorage.setItem("ozotoken", "local");
      setTimeout(() => onLogin(ADMIN_USER), 300);
      return;
    }

    // Step 2: Check local users (same device)
    const localMatch = users.find(u => u.email.toLowerCase() === input && u.password === password);
    if (localMatch) {
      localStorage.setItem("ozotoken", "local");
      setTimeout(() => onLogin(localMatch), 300);
      return;
    }

    // Step 3: Sync users from backend then re-check (different device)
    const backendUsers = await fetchBackendUsers();
    if (backendUsers.length && onSyncUsers) onSyncUsers(backendUsers);

    // Step 4: Try backend auth (validates password via bcrypt)
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: input, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError("Invalid email or password."); setLoading(false); return; }
      localStorage.setItem("ozotoken", data.token);
      // Find the synced user to get full profile (color, initials, etc.)
      const synced = backendUsers.find(u => u.email.toLowerCase() === input);
      const backendUser = synced || {
        id: data.user._id, backendId: data.user._id,
        name: data.user.name, email: data.user.email,
        role: data.user.role, team: data.user.team || "General",
        phone: data.user.phone || "", designation: data.user.designation || "",
        initials: data.user.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase(),
        color: "bg-indigo-500",
      };
      onLogin(backendUser);
    } catch {
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4 bg-white rounded-2xl shadow-sm px-6 py-3 border border-gray-100">
            <img src="/ozone-logo.jpg" alt="Ozone" className="h-10 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">OzoTask</h1>
          <p className="text-gray-400 text-sm mt-1">Task delegation & team management</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7">
          <h2 className="text-base font-semibold text-gray-800 mb-5">Sign in</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Username / Email</label>
              <input type="text" value={email} onChange={e=>{setEmail(e.target.value);setError("");}}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                placeholder="Username or email" autoComplete="username"/>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass?"text":"password"} value={password} onChange={e=>{setPassword(e.target.value);setError("");}}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all pr-10"
                  placeholder="Enter your password" autoComplete="current-password"/>
                <button type="button" onClick={()=>setShowPass(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><Eye size={16}/></button>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0"/>
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}
            <button type="submit" disabled={loading}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-sm ${loading?"bg-indigo-400 cursor-not-allowed":"bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99]"}`}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-400 mt-5">OzoTask · Powered by Ozone</p>
      </div>
    </div>
  );
};

const NAV = [
  { id:"dashboard",     icon:LayoutDashboard, label:"Dashboard" },
  { id:"tasks",         icon:CheckSquare,     label:"Tasks" },
  { id:"projects",      icon:FolderOpen,      label:"Projects" },
  { id:"team",          icon:Users,           label:"Team",          adminOnly:false, managerOnly:true },
  { id:"notifications", icon:Bell,            label:"Notifications" },
  { id:"settings",      icon:Settings,        label:"Settings",      adminOnly:true },
];

const Sidebar = ({ currentUser, view, setView, unreadCount, collapsed, setCollapsed }) => {
  const isOwner = currentUser.role === "owner";
  const isManager = currentUser.role === "manager";
  const navItems = NAV.filter(n => {
    if (n.adminOnly) return isOwner;
    if (n.managerOnly) return isOwner || isManager;
    return true;
  });
  return (
    <aside className={`flex flex-col bg-gray-900 text-white transition-all duration-200 flex-shrink-0 ${collapsed ? "w-16" : "w-56"}`}>
      <div className={`flex items-center gap-2.5 p-3 border-b border-gray-800 ${collapsed ? "justify-center" : ""}`}>
        <div className={`bg-white rounded-xl flex items-center justify-center flex-shrink-0 ${collapsed ? "w-10 h-10 p-1" : "px-3 py-2"}`}>
          <img src="/ozone-logo.jpg" alt="Ozone" className={`object-contain ${collapsed ? "w-8 h-8" : "h-7"}`} />
        </div>
      </div>
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setView(id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all relative ${view === id ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"} ${collapsed ? "justify-center" : ""}`}>
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
            {id === "notifications" && unreadCount > 0 && (
              <span className={`${collapsed ? "absolute top-1 right-1" : "ml-auto"} min-w-[18px] h-[18px] bg-red-500 rounded-full text-white text-xs flex items-center justify-center px-1`}>{unreadCount}</span>
            )}
          </button>
        ))}
      </nav>
      <div className={`p-3 border-t border-gray-800 flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}>
        <Avatar user={currentUser} size="sm" />
        {!collapsed && <div className="flex-1 min-w-0"><div className="text-xs font-semibold truncate">{currentUser.name}</div><div className="text-xs text-gray-500 capitalize">{currentUser.role}</div></div>}
      </div>
    </aside>
  );
};

const Header = ({ title, currentUser, onLogout, onCollapse }) => (
  <header className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-100 flex-shrink-0">
    <div className="flex items-center gap-3">
      <button onClick={onCollapse} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><Menu size={18} /></button>
      <h1 className="text-base font-semibold text-gray-900">{title}</h1>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 hidden sm:block">{currentUser.name}</span>
      <button onClick={onLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
        <LogOut size={15} /><span className="hidden sm:inline">Sign out</span>
      </button>
    </div>
  </header>
);

const StatCard = ({ label, value, sub, icon: Icon, color }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4">
    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}><Icon size={18} className="text-white" /></div>
    <div><div className="text-2xl font-bold text-gray-900">{value}</div><div className="text-sm text-gray-500">{label}</div>{sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}</div>
  </div>
);

const DashboardView = ({ currentUser, tasks, projects, notifications, setView, openCreateTask }) => {
  const myTasks = currentUser.role === "owner" ? tasks : tasks.filter(t => t.assignees.includes(currentUser.id) || t.createdBy === currentUser.id);
  const todo = myTasks.filter(t=>t.status==="todo").length;
  const inprogress = myTasks.filter(t=>t.status==="inprogress").length;
  const done = myTasks.filter(t=>t.status==="done").length;
  const overdue = myTasks.filter(t=>isOverdue(t.dueDate,t.status)).length;
  const unreadNotifs = notifications.filter(n=>!n.read).length;
  const recentTasks = [...myTasks].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5);
  const urgentTasks = myTasks.filter(t=>(t.priority==="urgent"||t.priority==="high")&&t.status!=="done").slice(0,3);
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-gray-900">Welcome back, {currentUser.name.split(" ")[0]} 👋</h2><p className="text-sm text-gray-500 mt-0.5">Here's what's happening today</p></div>
        {(currentUser.role==="owner"||currentUser.role==="manager") && <Btn onClick={openCreateTask}><Plus size={15}/> New Task</Btn>}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="To Do" value={todo} icon={Circle} color="bg-gray-400" sub={`${myTasks.length} total`} />
        <StatCard label="In Progress" value={inprogress} icon={RefreshCw} color="bg-blue-500" sub="active" />
        <StatCard label="Completed" value={done} icon={CheckCircle2} color="bg-green-500" sub="this sprint" />
        <StatCard label="Overdue" value={overdue} icon={AlertTriangle} color="bg-red-500" sub="needs attention" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-gray-900">Recent Tasks</h3><button onClick={()=>setView("tasks")} className="text-xs text-indigo-600 hover:underline">View all</button></div>
          <div className="space-y-2.5">
            {recentTasks.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No tasks yet</p>}
            {recentTasks.map(task => {
              const proj = projects.find(p=>p.id===task.projectId);
              const over = isOverdue(task.dueDate,task.status);
              return (
                <div key={task.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${PRIORITY[task.priority]?.dot||"bg-gray-400"}`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="text-sm font-medium text-gray-900 truncate">{task.title}</span>{task.type==="collaborative"&&<span className="text-xs bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded">Team</span>}</div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">{proj&&<span className="text-xs text-gray-400">{proj.emoji} {proj.name}</span>}<span className={`text-xs ${over?"text-red-500 font-medium":"text-gray-400"}`}>{over?"Overdue · ":""}{fmtDate(task.dueDate)}</span></div>
                  </div>
                  <StatusChip status={task.status} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="space-y-4">
          {urgentTasks.length > 0 && (
            <div className="bg-red-50 rounded-xl border border-red-100 p-4">
              <div className="flex items-center gap-2 mb-3"><AlertTriangle size={15} className="text-red-500" /><h3 className="font-semibold text-red-700 text-sm">Urgent / High Priority</h3></div>
              <div className="space-y-2">{urgentTasks.map(t=><div key={t.id} className="text-xs text-red-700 bg-white rounded-lg p-2.5 border border-red-100"><div className="font-medium">{t.title}</div><div className="text-red-400 mt-0.5">Due {fmtDate(t.dueDate)}</div></div>)}</div>
            </div>
          )}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3"><h3 className="font-semibold text-gray-900 text-sm">Projects</h3><button onClick={()=>setView("projects")} className="text-xs text-indigo-600 hover:underline">View all</button></div>
            <div className="space-y-3">{projects.slice(0,4).map(proj=>{const projTasks=tasks.filter(t=>t.projectId===proj.id);const doneTasks=projTasks.filter(t=>t.status==="done").length;const pct=projTasks.length?Math.round((doneTasks/projTasks.length)*100):0;return(<div key={proj.id}><div className="flex items-center justify-between text-xs mb-1"><span className="font-medium text-gray-700">{proj.emoji} {proj.name}</span><span className="text-gray-400">{pct}%</span></div><div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full transition-all" style={{width:`${pct}%`}}></div></div></div>);})}</div>
          </div>
          {unreadNotifs > 0 && <button onClick={()=>setView("notifications")} className="w-full bg-amber-50 rounded-xl border border-amber-100 p-4 text-left hover:bg-amber-100 transition-colors"><div className="flex items-center gap-2"><Bell size={15} className="text-amber-500"/><span className="text-sm font-medium text-amber-700">{unreadNotifs} unread notification{unreadNotifs>1?"s":""}</span></div><p className="text-xs text-amber-600 mt-1">Click to view emails & WhatsApp updates</p></button>}
        </div>
      </div>
    </div>
  );
};

const getAssignable = (currentUser, users) => {
  if (currentUser.role === "owner") return users;
  if (currentUser.role === "manager") {
    return users.filter(u =>
      u.id === currentUser.id ||
      u.reportsTo === currentUser.id ||
      u.id === currentUser.reportsTo
    );
  }
  // employee: self + their direct manager
  return users.filter(u =>
    u.id === currentUser.id ||
    u.id === currentUser.reportsTo
  );
};

const CreateTaskModal = ({ open, onClose, currentUser, projects, users, onSubmit }) => {
  const empty = { title:"", description:"", projectId:"", assignees:[], priority:"medium", type:"individual", dueDate:"", autoFollowUp:true };
  const [form, setForm] = useState(empty);
  const [step, setStep] = useState(1);
  useEffect(() => { if (!open) { setForm(empty); setStep(1); } }, [open]);
  const assignable = getAssignable(currentUser, users);
  const toggleAssignee = (id) => setForm(f=>({...f,assignees:f.assignees.includes(id)?f.assignees.filter(x=>x!==id):[...f.assignees,id],type:[...f.assignees.filter(x=>x!==id),(f.assignees.includes(id)?[]:id)].length>1?"collaborative":"individual"}));
  const handleSubmit = () => { if (!form.title.trim()||!form.projectId||form.assignees.length===0||!form.dueDate) return; onSubmit({...form,projectId:parseInt(form.projectId)}); onClose(); };
  return (
    <Modal open={open} onClose={onClose} title="Create New Task" width="max-w-xl">
      <div className="space-y-4">
        <div className="flex gap-2 mb-2">{[1,2].map(s=><div key={s} className={`h-1 flex-1 rounded-full transition-colors ${step>=s?"bg-indigo-500":"bg-gray-200"}`}></div>)}</div>
        {step===1&&<div className="space-y-4">
          <div><label className="text-xs font-semibold text-gray-600 block mb-1.5">Task Title *</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" placeholder="What needs to be done?"/></div>
          <div><label className="text-xs font-semibold text-gray-600 block mb-1.5">Description</label><textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 resize-none" placeholder="Add more context..."/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold text-gray-600 block mb-1.5">Project *</label><select value={form.projectId} onChange={e=>setForm(f=>({...f,projectId:e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"><option value="">Select project</option>{projects.map(p=><option key={p.id} value={p.id}>{p.emoji} {p.name}</option>)}</select></div>
            <div><label className="text-xs font-semibold text-gray-600 block mb-1.5">Due Date *</label><input type="date" value={form.dueDate} onChange={e=>setForm(f=>({...f,dueDate:e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"/></div>
          </div>
          <div><label className="text-xs font-semibold text-gray-600 block mb-1.5">Priority</label><div className="flex gap-2 flex-wrap">{Object.entries(PRIORITY).map(([key,val])=><button key={key} onClick={()=>setForm(f=>({...f,priority:key}))} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${form.priority===key?`${val.bg} ${val.text} border-transparent`:"border-gray-200 text-gray-600 hover:border-gray-300"}`}><span className={`w-1.5 h-1.5 rounded-full ${val.dot}`}></span>{val.label}</button>)}</div></div>
        </div>}
        {step===2&&<div className="space-y-4">
          <div><label className="text-xs font-semibold text-gray-600 block mb-2">Assign To * {form.assignees.length>0&&<span className="text-indigo-500">({form.assignees.length} selected)</span>}</label>
          <div className="space-y-2 max-h-52 overflow-y-auto">{assignable.map(u=>{
            const isSelf = u.id === currentUser.id;
            const isManager = u.id === currentUser.reportsTo;
            return (
              <button key={u.id} onClick={()=>toggleAssignee(u.id)} className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left ${form.assignees.includes(u.id)?"border-indigo-400 bg-indigo-50":"border-gray-100 hover:border-gray-200"}`}>
                <Avatar user={u} size="sm"/>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-gray-900">{u.name}</span>
                    {isSelf && <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">You</span>}
                    {isManager && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">Your Manager</span>}
                  </div>
                  <div className="text-xs text-gray-400 capitalize">{u.designation || u.role} · {u.team}</div>
                </div>
                {form.assignees.includes(u.id)&&<Check size={14} className="text-indigo-500"/>}
              </button>
            );
          })}</div></div>
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Notifications</p>
            <label className="flex items-center gap-3 cursor-pointer"><div onClick={()=>setForm(f=>({...f,autoFollowUp:!f.autoFollowUp}))} className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${form.autoFollowUp?"bg-indigo-500":"bg-gray-200"}`}><div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.autoFollowUp?"translate-x-5":"translate-x-0.5"}`}></div></div><div><div className="text-sm font-medium text-gray-800">Auto follow-up reminders</div><div className="text-xs text-gray-500">Send email & WhatsApp reminders before due date</div></div></label>
            <div className="flex gap-3 text-xs text-gray-500"><div className="flex items-center gap-1.5"><Mail size={12} className="text-gray-400"/>Email on assign</div><div className="flex items-center gap-1.5"><MessageCircle size={12} className="text-green-500"/>WhatsApp on assign</div></div>
          </div>
        </div>}
        <div className="flex justify-between pt-2 border-t border-gray-100">
          {step===2?<Btn onClick={()=>setStep(1)} variant="secondary">Back</Btn>:<Btn onClick={onClose} variant="secondary">Cancel</Btn>}
          {step===1?<Btn onClick={()=>setStep(2)} disabled={!form.title.trim()||!form.projectId||!form.dueDate}>Next: Assign →</Btn>:<Btn onClick={handleSubmit} disabled={form.assignees.length===0} variant="success"><Send size={14}/>Create & Notify</Btn>}
        </div>
      </div>
    </Modal>
  );
};

const TaskDetailModal = ({ open, onClose, task, projects, users, currentUser, onUpdate, onDelete }) => {
  const [comment, setComment] = useState("");
  if (!task) return null;
  const proj = projects.find(p=>p.id===task.projectId);
  const creator = getUserById(task.createdBy, users);
  const over = isOverdue(task.dueDate, task.status);
  const postComment = () => { if (!comment.trim()) return; onUpdate(task.id,{comments:[...(task.comments||[]),{userId:currentUser.id,text:comment.trim(),ts:new Date().toISOString()}]}); setComment(""); };
  const changeStatus = (status) => onUpdate(task.id,{status});
  return (
    <Modal open={open} onClose={onClose} title={task.title} width="max-w-2xl">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2"><PriorityChip priority={task.priority}/><StatusChip status={task.status}/>{task.type==="collaborative"&&<Chip className="bg-indigo-50 text-indigo-600">👥 Collaborative</Chip>}{over&&<Chip className="bg-red-50 text-red-600">⚠️ Overdue</Chip>}{task.autoFollowUp&&<Chip className="bg-green-50 text-green-700"><Zap size={10}/>Auto follow-up on</Chip>}</div>
        {task.description&&<p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{task.description}</p>}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-xs text-gray-400 font-medium mb-1">Project</p><p className="font-medium text-gray-800">{proj?`${proj.emoji} ${proj.name}`:"—"}</p></div>
          <div><p className="text-xs text-gray-400 font-medium mb-1">Due Date</p><p className={`font-medium ${over?"text-red-600":"text-gray-800"}`}>{fmtDate(task.dueDate)}</p></div>
          <div><p className="text-xs text-gray-400 font-medium mb-1">Created by</p><div className="flex items-center gap-1.5">{creator&&<Avatar user={creator} size="xs"/>}<span className="font-medium text-gray-800">{creator?.name||"—"}</span></div></div>
          <div><p className="text-xs text-gray-400 font-medium mb-1">Assignees</p><div className="flex -space-x-1.5">{task.assignees.map(id=>{const u=getUserById(id,users);return u?<Avatar key={id} user={u} size="sm" className="ring-2 ring-white"/>:null;})}</div></div>
        </div>
        <div><p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">Update Status</p><div className="flex gap-2 flex-wrap">{Object.entries(STATUS).map(([key,val])=><button key={key} onClick={()=>changeStatus(key)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${task.status===key?`${val.bg} ${val.text} border-transparent`:"border-gray-200 text-gray-500 hover:border-gray-300"}`}>{val.label}</button>)}</div></div>
        <div>
          <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">Comments</p>
          <div className="space-y-2 max-h-36 overflow-y-auto mb-3">{(!task.comments||task.comments.length===0)&&<p className="text-sm text-gray-400 text-center py-3">No comments yet</p>}{(task.comments||[]).map((c,i)=>{const u=getUserById(c.userId,users);return(<div key={i} className="flex gap-2.5"><Avatar user={u} size="xs" className="mt-0.5"/><div className="bg-gray-50 rounded-xl px-3 py-2 text-sm flex-1"><span className="font-medium text-gray-800 mr-1.5">{u?.name}</span><span className="text-gray-600">{c.text}</span><div className="text-xs text-gray-400 mt-0.5">{fmtTime(c.ts)}</div></div></div>);})}</div>
          <div className="flex gap-2"><Avatar user={currentUser} size="sm" className="mt-0.5"/><div className="flex-1 flex gap-2"><input value={comment} onChange={e=>setComment(e.target.value)} onKeyDown={e=>e.key==="Enter"&&postComment()} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" placeholder="Add a comment..."/><Btn onClick={postComment} size="sm" disabled={!comment.trim()}><Send size={13}/></Btn></div></div>
        </div>
        {(currentUser.role==="owner"||currentUser.role==="manager")&&<div className="pt-2 border-t border-gray-100 flex justify-end"><Btn onClick={()=>{onDelete(task.id);onClose();}} variant="danger" size="sm"><Trash2 size={13}/>Delete Task</Btn></div>}
      </div>
    </Modal>
  );
};

const KANBAN_COLS = [
  { key:"todo",       label:"To Do",       border:"border-t-gray-400",   dot:"bg-gray-400" },
  { key:"inprogress", label:"In Progress", border:"border-t-blue-500",   dot:"bg-blue-500" },
  { key:"review",     label:"In Review",   border:"border-t-purple-500", dot:"bg-purple-500" },
  { key:"done",       label:"Done",        border:"border-t-green-500",  dot:"bg-green-500" },
];

const TaskCard = ({ task, projects, users, onClick }) => {
  const proj = projects.find(p=>p.id===task.projectId);
  const over = isOverdue(task.dueDate,task.status);
  return (
    <div onClick={onClick} className="bg-white border border-gray-100 rounded-xl p-3.5 cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all space-y-2.5">
      <div className="flex items-start justify-between gap-2"><p className="text-sm font-medium text-gray-900 leading-snug">{task.title}</p><PriorityChip priority={task.priority}/></div>
      {proj&&<div className="text-xs text-gray-400">{proj.emoji} {proj.name}</div>}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-1.5">{task.assignees.slice(0,3).map(id=>{const u=getUserById(id,users);return u?<Avatar key={id} user={u} size="xs" className="ring-2 ring-white"/>:null;})}{task.assignees.length>3&&<div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 ring-2 ring-white">+{task.assignees.length-3}</div>}</div>
        <div className={`flex items-center gap-1 text-xs ${over?"text-red-500 font-medium":"text-gray-400"}`}><Clock size={11}/>{over?"Overdue":fmtDate(task.dueDate)}</div>
      </div>
      {task.type==="collaborative"&&<div className="text-xs text-indigo-500 flex items-center gap-1"><Users size={10}/>Collaborative</div>}
    </div>
  );
};

const TasksView = ({ currentUser, tasks, projects, users, openCreateTask, openTaskDetail }) => {
  const [viewMode, setViewMode] = useState("kanban");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const [search, setSearch] = useState("");
  const canSeeAll = currentUser.role === "owner";
  const baseTasks = canSeeAll ? tasks : tasks.filter(t=>t.assignees.includes(currentUser.id)||t.createdBy===currentUser.id);
  const filtered = baseTasks.filter(t=>(filterPriority==="all"||t.priority===filterPriority)&&(filterProject==="all"||t.projectId===parseInt(filterProject))&&(!search||t.title.toLowerCase().includes(search.toLowerCase())));
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 px-6 py-3.5 bg-white border-b border-gray-100">
        <div className="relative flex-1 min-w-[180px] max-w-xs"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400" placeholder="Search tasks..."/></div>
        <select value={filterProject} onChange={e=>setFilterProject(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-400"><option value="all">All Projects</option>{projects.map(p=><option key={p.id} value={p.id}>{p.emoji} {p.name}</option>)}</select>
        <select value={filterPriority} onChange={e=>setFilterPriority(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-400"><option value="all">All Priorities</option>{Object.entries(PRIORITY).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 ml-auto"><button onClick={()=>setViewMode("kanban")} className={`p-1.5 rounded-md transition-colors ${viewMode==="kanban"?"bg-white shadow text-indigo-600":"text-gray-500 hover:text-gray-700"}`}><Columns size={16}/></button><button onClick={()=>setViewMode("list")} className={`p-1.5 rounded-md transition-colors ${viewMode==="list"?"bg-white shadow text-indigo-600":"text-gray-500 hover:text-gray-700"}`}><List size={16}/></button></div>
        {(currentUser.role==="owner"||currentUser.role==="manager")&&<Btn onClick={openCreateTask} size="sm"><Plus size={14}/>New Task</Btn>}
      </div>
      {viewMode==="kanban"&&<div className="flex-1 overflow-x-auto overflow-y-auto p-6"><div className="flex gap-4 h-full min-w-max">{KANBAN_COLS.map(col=>{const colTasks=filtered.filter(t=>t.status===col.key);return(<div key={col.key} className="w-72 flex flex-col flex-shrink-0"><div className={`bg-white rounded-xl border-2 border-t-4 ${col.border} border-gray-100 overflow-hidden flex flex-col`}><div className="flex items-center justify-between px-4 py-3 border-b border-gray-50"><div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${col.dot}`}></span><span className="text-sm font-semibold text-gray-800">{col.label}</span></div><span className="text-xs font-semibold text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">{colTasks.length}</span></div><div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[calc(100vh-260px)]">{colTasks.length===0&&<div className="text-center py-8 text-gray-300"><CheckSquare size={24} className="mx-auto mb-2"/><p className="text-xs">No tasks</p></div>}{colTasks.map(t=><TaskCard key={t.id} task={t} projects={projects} users={users} onClick={()=>openTaskDetail(t)}/>)}</div></div></div>);})}</div></div>}
      {viewMode==="list"&&<div className="flex-1 overflow-y-auto p-6"><div className="bg-white rounded-xl border border-gray-100 overflow-hidden"><table className="w-full text-sm"><thead><tr className="text-xs text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-100 bg-gray-50"><th className="text-left px-4 py-3">Task</th><th className="text-left px-4 py-3 hidden md:table-cell">Project</th><th className="text-left px-4 py-3">Assignees</th><th className="text-left px-4 py-3">Priority</th><th className="text-left px-4 py-3">Due</th><th className="text-left px-4 py-3">Status</th><th className="px-4 py-3"></th></tr></thead><tbody>{filtered.length===0&&<tr><td colSpan={7} className="text-center py-12 text-gray-400">No tasks found</td></tr>}{filtered.map((t,i)=>{const proj=projects.find(p=>p.id===t.projectId);const over=isOverdue(t.dueDate,t.status);return(<tr key={t.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${i%2===0?"":"bg-gray-50/30"}`} onClick={()=>openTaskDetail(t)}><td className="px-4 py-3"><div className="font-medium text-gray-900">{t.title}</div>{t.type==="collaborative"&&<span className="text-xs text-indigo-500">👥 Team</span>}</td><td className="px-4 py-3 hidden md:table-cell text-gray-500">{proj?`${proj.emoji} ${proj.name}`:"—"}</td><td className="px-4 py-3"><div className="flex -space-x-1.5">{t.assignees.slice(0,3).map(id=>{const u=getUserById(id,users);return u?<Avatar key={id} user={u} size="xs" className="ring-2 ring-white"/>:null;})}</div></td><td className="px-4 py-3"><PriorityChip priority={t.priority}/></td><td className={`px-4 py-3 text-xs ${over?"text-red-500 font-medium":"text-gray-500"}`}>{fmtDate(t.dueDate)}</td><td className="px-4 py-3"><StatusChip status={t.status}/></td><td className="px-4 py-3 text-gray-400"><ChevronRight size={14}/></td></tr>);})}</tbody></table></div></div>}
    </div>
  );
};

const PROJECT_COLORS = [
  { label:"Blue",   value:"bg-blue-500" },
  { label:"Green",  value:"bg-green-500" },
  { label:"Purple", value:"bg-purple-500" },
  { label:"Orange", value:"bg-orange-500" },
  { label:"Pink",   value:"bg-pink-500" },
  { label:"Teal",   value:"bg-teal-500" },
  { label:"Red",    value:"bg-red-500" },
  { label:"Indigo", value:"bg-indigo-500" },
];
const PROJECT_EMOJIS = ["🌐","📣","📱","👥","🚀","💡","📊","🎯","🛠️","📋","🔥","⚡","🌟","🎨","📦"];

const ProjectModal = ({ open, onClose, project, users, currentUser, onSubmit }) => {
  const empty = { name:"", description:"", emoji:"🚀", color:"bg-blue-500", deadline:"", members:[], owner: currentUser.id };
  const [form, setForm] = useState(empty);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(project ? { name:project.name, description:project.description||"", emoji:project.emoji, color:project.color, deadline:project.deadline, members:project.members, owner:project.owner } : { ...empty, owner: currentUser.id });
      setDeleteConfirm(false);
    }
  }, [open, project]);

  const toggleMember = (id) => setForm(f => ({ ...f, members: f.members.includes(id) ? f.members.filter(x=>x!==id) : [...f.members, id] }));
  const handleSubmit = () => {
    if (!form.name.trim() || !form.deadline || form.members.length === 0) return;
    onSubmit({ ...form });
    onClose();
  };
  const isEditing = !!project;

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? "Edit Project" : "New Project"} width="max-w-xl">
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1.5">Project Name *</label>
          <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" placeholder="e.g. Website Redesign"/>
        </div>
        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1.5">Description</label>
          <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 resize-none" placeholder="What is this project about?"/>
        </div>
        {/* Emoji + Color + Deadline */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Emoji</label>
            <div className="flex flex-wrap gap-1.5 border border-gray-200 rounded-lg p-2 max-h-24 overflow-y-auto">
              {PROJECT_EMOJIS.map(e=>(
                <button key={e} onClick={()=>setForm(f=>({...f,emoji:e}))} className={`text-lg p-0.5 rounded transition-all ${form.emoji===e?"ring-2 ring-indigo-400 bg-indigo-50":""}`}>{e}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Color</label>
            <div className="flex flex-wrap gap-2 border border-gray-200 rounded-lg p-2">
              {PROJECT_COLORS.map(c=>(
                <button key={c.value} onClick={()=>setForm(f=>({...f,color:c.value}))} className={`w-6 h-6 rounded-full ${c.value} transition-all ${form.color===c.value?"ring-2 ring-offset-1 ring-indigo-400 scale-110":""}`} title={c.label}/>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Deadline *</label>
            <input type="date" value={form.deadline} onChange={e=>setForm(f=>({...f,deadline:e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"/>
          </div>
        </div>
        {/* Members */}
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1.5">Assign Members * {form.members.length>0&&<span className="text-indigo-500">({form.members.length} selected)</span>}</label>
          <div className="space-y-1.5 max-h-44 overflow-y-auto border border-gray-100 rounded-xl p-2">
            {users.map(u=>(
              <button key={u.id} onClick={()=>toggleMember(u.id)} className={`w-full flex items-center gap-3 p-2 rounded-xl border transition-all text-left ${form.members.includes(u.id)?"border-indigo-400 bg-indigo-50":"border-gray-100 hover:border-gray-200"}`}>
                <Avatar user={u} size="sm"/>
                <div className="flex-1"><div className="text-sm font-medium text-gray-900">{u.name}</div><div className="text-xs text-gray-400 capitalize">{u.role} · {u.team}</div></div>
                {form.members.includes(u.id)&&<Check size={14} className="text-indigo-500"/>}
              </button>
            ))}
          </div>
        </div>
        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          {isEditing ? (
            deleteConfirm
              ? <div className="flex items-center gap-2"><span className="text-xs text-red-600">Delete this project?</span><Btn variant="danger" size="sm" onClick={()=>{onSubmit(null,"delete");onClose();}}>Yes, Delete</Btn><Btn variant="secondary" size="sm" onClick={()=>setDeleteConfirm(false)}>Cancel</Btn></div>
              : <Btn variant="danger" size="sm" onClick={()=>setDeleteConfirm(true)}><Trash2 size={13}/>Delete Project</Btn>
          ) : <div/>}
          <div className="flex gap-2">
            <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
            <Btn onClick={handleSubmit} disabled={!form.name.trim()||!form.deadline||form.members.length===0}>{isEditing?"Save Changes":"Create Project"}</Btn>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const ProjectsView = ({ projects, tasks, users, currentUser, onCreateProject, onEditProject, onDeleteProject }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const canManage = currentUser.role === "owner" || currentUser.role === "manager";

  const handleSubmit = (form, action) => {
    if (action === "delete") { onDeleteProject(editingProject.id); }
    else if (editingProject) { onEditProject(editingProject.id, form); }
    else { onCreateProject(form); }
    setEditingProject(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {canManage && (
        <div className="flex justify-end mb-5">
          <Btn onClick={()=>{ setEditingProject(null); setModalOpen(true); }}><Plus size={15}/>New Project</Btn>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map(proj=>{
          const projTasks=tasks.filter(t=>t.projectId===proj.id);
          const done=projTasks.filter(t=>t.status==="done").length;
          const inprog=projTasks.filter(t=>t.status==="inprogress").length;
          const todo=projTasks.filter(t=>t.status==="todo").length;
          const pct=projTasks.length?Math.round((done/projTasks.length)*100):0;
          const over=projTasks.filter(t=>isOverdue(t.dueDate,t.status)).length;
          const owner=getUserById(proj.owner,users);
          return(
            <div key={proj.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 ${proj.color} rounded-xl flex items-center justify-center text-xl shadow-sm`}>{proj.emoji}</div>
                  <div><h3 className="font-semibold text-gray-900">{proj.name}</h3><p className="text-xs text-gray-400 mt-0.5">{proj.description}</p></div>
                </div>
                <div className="flex items-center gap-1.5">
                  {over>0&&<span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full flex items-center gap-1"><AlertTriangle size={11}/>{over} overdue</span>}
                  {canManage && (
                    <button onClick={()=>{ setEditingProject(proj); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors" title="Edit project">
                      <Edit3 size={14}/>
                    </button>
                  )}
                </div>
              </div>
              <div className="mb-4"><div className="flex justify-between text-xs text-gray-500 mb-1.5"><span>{pct}% complete</span><span>{done}/{projTasks.length} tasks</span></div><div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${proj.color} rounded-full transition-all`} style={{width:`${pct}%`}}></div></div></div>
              <div className="flex gap-3 mb-4">{[["To Do",todo,"bg-gray-200 text-gray-600"],["In Progress",inprog,"bg-blue-100 text-blue-700"],["Done",done,"bg-green-100 text-green-700"]].map(([label,val,cls])=><div key={label} className={`flex-1 text-center py-2 rounded-xl ${cls}`}><div className="text-lg font-bold">{val}</div><div className="text-xs">{label}</div></div>)}</div>
              <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                <div className="flex items-center gap-1.5">{owner&&<Avatar user={owner} size="xs"/>}<span className="text-xs text-gray-500">{owner?.name}</span></div>
                <div className="flex items-center gap-1 text-xs text-gray-400"><Calendar size={11}/>{fmtDate(proj.deadline)}</div>
                <div className="flex -space-x-1.5">{proj.members.slice(0,4).map(id=>{const u=getUserById(id,users);return u?<Avatar key={id} user={u} size="xs" className="ring-2 ring-white"/>:null;})}{proj.members.length>4&&<div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 ring-2 ring-white">+{proj.members.length-4}</div>}</div>
              </div>
            </div>
          );
        })}
        {projects.length === 0 && (
          <div className="col-span-2 text-center py-16 text-gray-300">
            <FolderOpen size={40} className="mx-auto mb-3"/>
            <p className="font-medium">No projects yet</p>
            {canManage && <p className="text-sm mt-1">Click "New Project" to get started</p>}
          </div>
        )}
      </div>
      <ProjectModal open={modalOpen} onClose={()=>{ setModalOpen(false); setEditingProject(null); }} project={editingProject} users={users} currentUser={currentUser} onSubmit={handleSubmit}/>
    </div>
  );
};

// ─── Settings View ────────────────────────────────────────────────────────────
const SettingsView = ({ teams, setTeams, designations, setDesignations, roles, setRoles }) => {
  const [activeTab, setActiveTab] = useState("teams");
  const [newItem, setNewItem] = useState("");
  const [editingIdx, setEditingIdx] = useState(null);
  const [editVal, setEditVal] = useState("");

  const configs = {
    teams:        { label:"Teams",        icon:Briefcase, list:teams,        setList:setTeams,        placeholder:"e.g. Engineering" },
    designations: { label:"Designations", icon:Tag,       list:designations, setList:setDesignations, placeholder:"e.g. Senior Engineer" },
    roles:        { label:"Roles",        icon:Shield,    list:roles,        setList:setRoles,        placeholder:"e.g. manager" },
  };
  const cfg = configs[activeTab];

  const handleAdd = () => {
    const val = newItem.trim();
    if (!val || cfg.list.includes(val)) return;
    cfg.setList(prev => [...prev, val]);
    setNewItem("");
  };

  const handleDelete = (idx) => {
    cfg.setList(prev => prev.filter((_, i) => i !== idx));
  };

  const handleEdit = (idx) => {
    setEditingIdx(idx);
    setEditVal(cfg.list[idx]);
  };

  const handleEditSave = (idx) => {
    const val = editVal.trim();
    if (!val) return;
    cfg.setList(prev => prev.map((item, i) => i === idx ? val : item));
    setEditingIdx(null);
    setEditVal("");
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Admin Settings</h2>
          <p className="text-sm text-gray-400 mt-0.5">Manage dropdown options used across the platform</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 bg-gray-100 p-1 rounded-xl w-fit">
          {Object.entries(configs).map(([key, c]) => (
            <button key={key} onClick={() => { setActiveTab(key); setNewItem(""); setEditingIdx(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              <c.icon size={14}/>{c.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Add new */}
          <div className="p-4 border-b border-gray-100 flex gap-2">
            <input value={newItem} onChange={e=>setNewItem(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleAdd()}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
              placeholder={cfg.placeholder}/>
            <Btn onClick={handleAdd} disabled={!newItem.trim()}><Plus size={14}/>Add</Btn>
          </div>

          {/* List */}
          <div className="divide-y divide-gray-50">
            {cfg.list.length === 0 && (
              <div className="text-center py-10 text-gray-300 text-sm">No items yet</div>
            )}
            {cfg.list.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 group transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${USER_COLORS[idx % USER_COLORS.length]}`}/>
                {editingIdx === idx ? (
                  <div className="flex-1 flex gap-2">
                    <input value={editVal} onChange={e=>setEditVal(e.target.value)}
                      onKeyDown={e=>{ if(e.key==="Enter") handleEditSave(idx); if(e.key==="Escape") setEditingIdx(null); }}
                      autoFocus
                      className="flex-1 border border-indigo-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400"/>
                    <Btn size="sm" onClick={()=>handleEditSave(idx)}>Save</Btn>
                    <Btn size="sm" variant="secondary" onClick={()=>setEditingIdx(null)}>Cancel</Btn>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-gray-800 capitalize">{item}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={()=>handleEdit(idx)} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"><Edit3 size={13}/></button>
                      <button onClick={()=>handleDelete(idx)} className="p-1.5 hover:bg-red-100 rounded-lg text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={13}/></button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-400">{cfg.list.length} {cfg.label.toLowerCase()} configured · Changes apply immediately to all dropdowns</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserModal = ({ open, onClose, user, onSubmit, onDelete, allUsers, teams=DEFAULT_TEAMS, designations=DEFAULT_DESIGNATIONS, roles=DEFAULT_ROLES }) => {
  const empty = { name:"", email:"", password:"", role:"employee", designation:"", team:"Engineering", phone:"", color:"bg-blue-500", reportsTo:"" };
  const [form, setForm] = useState(empty);
  const [showPass, setShowPass] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const isEditing = !!user;

  useEffect(() => {
    if (open) { setForm(user ? { ...user } : empty); setDeleteConfirm(false); setShowPass(false); }
  }, [open, user]);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim() || (!isEditing && !form.password.trim())) return;
    const initials = form.name.trim().split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);
    onSubmit({ ...form, initials });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? "Edit Team Member" : "Add New Team Member"} width="max-w-lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Full Name *</label>
            <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" placeholder="e.g. Rahul Sharma"/>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Email Address *</label>
            <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" placeholder="rahul@company.com"/>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">{isEditing ? "New Password" : "Password *"} {isEditing && <span className="text-gray-400 font-normal">(leave blank to keep current)</span>}</label>
            <div className="relative">
              <input type={showPass?"text":"password"} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 pr-9" placeholder="Set login password"/>
              <button type="button" onClick={()=>setShowPass(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><Eye size={14}/></button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Role *</label>
            <select value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400">
              {roles.map(r=><option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Team</label>
            <select value={form.team} onChange={e=>setForm(f=>({...f,team:e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400">
              {teams.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Designation</label>
            <select value={form.designation} onChange={e=>setForm(f=>({...f,designation:e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400">
              <option value="">Select designation</option>
              {designations.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Reports To</label>
            <select value={form.reportsTo} onChange={e=>setForm(f=>({...f,reportsTo:e.target.value?parseInt(e.target.value):""}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400">
              <option value="">— No reporting manager —</option>
              {(allUsers||[]).filter(u=>u.id!==(user?.id) && (u.role==="owner"||u.role==="manager")).map(u=>(
                <option key={u.id} value={u.id}>{u.name} ({u.designation||u.role})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Phone</label>
            <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" placeholder="+91 98765 43210"/>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Avatar Color</label>
            <div className="flex flex-wrap gap-2 border border-gray-200 rounded-lg p-2">
              {USER_COLORS.map(c=><button key={c} type="button" onClick={()=>setForm(f=>({...f,color:c}))} className={`w-6 h-6 rounded-full ${c} transition-all ${form.color===c?"ring-2 ring-offset-1 ring-indigo-400 scale-110":""}`}/>)}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          {isEditing ? (
            deleteConfirm
              ? <div className="flex items-center gap-2"><span className="text-xs text-red-600">Remove this member?</span><Btn variant="danger" size="sm" onClick={()=>{onDelete(user.id);onClose();}}>Yes, Remove</Btn><Btn variant="secondary" size="sm" onClick={()=>setDeleteConfirm(false)}>Cancel</Btn></div>
              : <Btn variant="danger" size="sm" onClick={()=>setDeleteConfirm(true)}><Trash2 size={13}/>Remove</Btn>
          ) : <div/>}
          <div className="flex gap-2">
            <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
            <Btn onClick={handleSubmit} disabled={!form.name.trim()||!form.email.trim()||(!isEditing&&!form.password.trim())}>{isEditing?"Save Changes":"Add Member"}</Btn>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const TeamView = ({ users, setUsers, tasks, currentUser, teams, designations, roles }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState("");
  const [syncMsg, setSyncMsg] = useState("");
  const isAdmin = currentUser.role === "owner";
  const allMembers = [ADMIN_USER, ...users];
  const visible = isAdmin ? allMembers : allMembers.filter(u => u.team === currentUser.team);
  const filtered = visible.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || (u.designation||"").toLowerCase().includes(search.toLowerCase()));

  const adminFetch = async (method, path, body) => {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
      body: body ? JSON.stringify(body) : undefined,
    });
    return res;
  };

  const handleSubmit = async (form) => {
    if (editingUser) {
      const updated = { ...editingUser, ...form, password: form.password || editingUser.password };
      setUsers(prev => prev.map(u => u.id === editingUser.id ? updated : u));
      try {
        await adminFetch("PUT", `/api/admin/users/${encodeURIComponent(editingUser.email)}`, {
          name: form.name, role: form.role, team: form.team,
          phone: form.phone, designation: form.designation,
          reportsTo: form.reportsTo || "",
          ...(form.password ? { password: form.password } : {}),
        });
        setSyncMsg("✓ User updated");
      } catch { setSyncMsg("✓ Updated locally"); }
      setTimeout(() => setSyncMsg(""), 2500);
    } else {
      const newUser = { ...form, id: Date.now() };
      setUsers(prev => [...prev, newUser]);
      try {
        const res = await adminFetch("POST", "/api/admin/users", {
          name: form.name, email: form.email, password: form.password,
          role: form.role, team: form.team, phone: form.phone, designation: form.designation,
          reportsTo: form.reportsTo || "",
        });
        setSyncMsg(res.ok ? "✓ User created — can log in from any device" : "✓ Created locally only");
      } catch { setSyncMsg("✓ Created locally only"); }
      setTimeout(() => setSyncMsg(""), 3000);
    }
    setEditingUser(null);
  };

  const handleDelete = async (id) => {
    const u = users.find(x => x.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    if (u) {
      try { await adminFetch("DELETE", `/api/admin/users/${encodeURIComponent(u.email)}`); } catch {}
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400" placeholder="Search members..."/>
        </div>
        <div className="flex items-center gap-3">
          {syncMsg && <span className="text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full">{syncMsg}</span>}
          {isAdmin && <Btn onClick={()=>{ setEditingUser(null); setModalOpen(true); }}><Plus size={15}/>Add Member</Btn>}
        </div>
      </div>

      {/* Summary bar for admin */}
      {isAdmin && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[["Total Members", allMembers.length, "bg-indigo-50 text-indigo-700"],["Managers", allMembers.filter(u=>u.role==="manager").length, "bg-blue-50 text-blue-700"],["Employees", allMembers.filter(u=>u.role==="employee").length, "bg-green-50 text-green-700"],["Teams", [...new Set(allMembers.map(u=>u.team))].length, "bg-orange-50 text-orange-700"]].map(([label,val,cls])=>(
            <div key={label} className={`rounded-xl p-3 text-center ${cls}`}><div className="text-xl font-bold">{val}</div><div className="text-xs mt-0.5">{label}</div></div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(u => {
          const assigned = tasks.filter(t => t.assignees.includes(u.id));
          const doneCount = assigned.filter(t=>t.status==="done").length;
          const activeCount = assigned.filter(t=>t.status==="inprogress").length;
          const overdueCount = assigned.filter(t=>isOverdue(t.dueDate,t.status)).length;
          const isOwner = u.id === ADMIN_USER.id;
          return (
            <div key={u.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar user={u} size="xl"/>
                  <div>
                    <div className="font-semibold text-gray-900">{u.name}</div>
                    <div className="text-xs text-indigo-600 font-medium">{u.designation || u.role}</div>
                    <div className="text-xs text-gray-400 capitalize mt-0.5">{u.team} · {u.role}</div>
                  </div>
                </div>
                {isAdmin && !isOwner && (
                  <button onClick={()=>{ setEditingUser(u); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"><Edit3 size={14}/></button>
                )}
                {isOwner && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">Admin</span>}
              </div>
              {u.phone && <div className="text-xs text-gray-400 flex items-center gap-1"><Phone size={10}/>{u.phone}</div>}
              {u.reportsTo && (() => { const mgr = allMembers.find(m=>m.id===u.reportsTo); return mgr ? <div className="text-xs text-gray-400 flex items-center gap-1 mb-1"><ArrowUpRight size={10}/>Reports to <span className="font-medium text-gray-600">{mgr.name}</span></div> : null; })()}
              {!u.reportsTo && !u.phone && <div className="mb-1"/>}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center bg-blue-50 rounded-xl py-2"><div className="text-lg font-bold text-blue-700">{activeCount}</div><div className="text-xs text-blue-500">Active</div></div>
                <div className="text-center bg-green-50 rounded-xl py-2"><div className="text-lg font-bold text-green-700">{doneCount}</div><div className="text-xs text-green-500">Done</div></div>
                <div className="text-center bg-red-50 rounded-xl py-2"><div className="text-lg font-bold text-red-700">{overdueCount}</div><div className="text-xs text-red-500">Overdue</div></div>
              </div>
              <div className="flex gap-1.5">
                {u.phone && <a href={`https://wa.me/${u.phone.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium py-2 rounded-xl hover:bg-green-100 transition-colors"><MessageCircle size={12}/>WhatsApp</a>}
                <a href={`mailto:${u.email}`} className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 text-gray-700 text-xs font-medium py-2 rounded-xl hover:bg-gray-100 transition-colors"><Mail size={12}/>Email</a>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-300">
            <Users size={36} className="mx-auto mb-3"/>
            <p className="font-medium">No members found</p>
          </div>
        )}
      </div>
      <UserModal open={modalOpen} onClose={()=>{ setModalOpen(false); setEditingUser(null); }} user={editingUser} onSubmit={handleSubmit} onDelete={handleDelete} allUsers={allMembers} teams={teams} designations={designations} roles={roles}/>
    </div>
  );
};

const NotificationsView = ({ notifications, setNotifications, tasks, users, currentUser }) => {
  const [tab, setTab] = useState("all");
  const [waReply, setWaReply] = useState("");
  const relevantNotifs = currentUser.role==="owner" ? notifications : notifications.filter(n=>(n.toUser===currentUser.id)||(n.fromUser===currentUser.id)||(n.taskId&&tasks.find(t=>t.id===n.taskId)?.assignees.includes(currentUser.id)));
  const emails=relevantNotifs.filter(n=>n.type==="email");
  const whatsapp=relevantNotifs.filter(n=>n.type==="whatsapp");
  const displayed=tab==="email"?emails:tab==="whatsapp"?whatsapp:relevantNotifs;
  const markAllRead=()=>setNotifications(prev=>prev.map(n=>({...n,read:true})));
  const sendWaReply=()=>{ if(!waReply.trim()) return; setNotifications(prev=>[...prev,{id:Date.now(),type:"whatsapp",fromUser:currentUser.id,message:waReply.trim(),ts:new Date().toISOString(),read:true,direction:"received"}]); setWaReply(""); };
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-100 flex-wrap gap-3">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">{[["all","All"],["email","Email"],["whatsapp","WhatsApp"]].map(([key,label])=><button key={key} onClick={()=>setTab(key)} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab===key?"bg-white shadow text-indigo-600":"text-gray-500 hover:text-gray-700"}`}>{key==="email"&&<Mail size={13}/>}{key==="whatsapp"&&<MessageCircle size={13} className="text-green-500"/>}{label}{key==="all"&&<span className="text-xs bg-gray-200 text-gray-600 rounded-full px-1.5">{relevantNotifs.filter(n=>!n.read).length}</span>}</button>)}</div>
        <Btn onClick={markAllRead} variant="secondary" size="sm"><Eye size={13}/>Mark all read</Btn>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {displayed.length===0&&<div className="text-center py-16 text-gray-300"><Bell size={32} className="mx-auto mb-3"/><p>No notifications</p></div>}
          {[...displayed].reverse().map(n=>{
            const isEmail=n.type==="email";
            const isReceived=n.direction==="received";
            const fromUser=n.fromUser?getUserById(n.fromUser,users):null;
            const toUser=n.toUser?getUserById(n.toUser,users):null;
            const task=tasks.find(t=>t.id===n.taskId);
            return(
              <div key={n.id} className={`bg-white rounded-2xl border p-4 transition-all cursor-pointer hover:shadow-sm ${!n.read&&!isReceived?"border-indigo-200 bg-indigo-50/30":"border-gray-100"} ${isReceived?"border-green-200 bg-green-50/30":""}`} onClick={()=>setNotifications(prev=>prev.map(x=>x.id===n.id?{...x,read:true}:x))}>
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isEmail?"bg-blue-100":"bg-green-100"}`}>{isEmail?<Mail size={16} className="text-blue-600"/>:<MessageCircle size={16} className="text-green-600"/>}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isEmail?"bg-blue-100 text-blue-700":"bg-green-100 text-green-700"}`}>{isEmail?"Email":"WhatsApp"}</span>{isReceived&&<span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">↩ Reply received</span>}{!n.read&&!isReceived&&<span className="w-2 h-2 rounded-full bg-indigo-500"></span>}<span className="text-xs text-gray-400 ml-auto">{fmtTime(n.ts)}</span></div>
                    {isEmail?<div className="mt-1.5"><p className="text-sm font-medium text-gray-900">{n.subject}</p><p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>{toUser&&<p className="text-xs text-gray-400 mt-1">To: {toUser.name} · {toUser.email}</p>}</div>:<div className="mt-1.5"><p className="text-xs text-gray-400 mb-1">{isReceived?`From: ${fromUser?.name}`:`To: ${toUser?.name} · ${toUser?.phone}`}{task&&` · re: ${task.title}`}</p><div className={`text-sm rounded-2xl px-3 py-2 inline-block max-w-full whitespace-pre-line ${isReceived?"bg-green-100 text-green-900":"bg-gray-100 text-gray-800"}`}>{n.message}</div></div>}
                    {task&&<div className="mt-2 flex items-center gap-1.5"><span className="text-xs text-gray-400">Task:</span><span className="text-xs font-medium text-indigo-600">{task.title}</span></div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {(tab==="whatsapp"||tab==="all")&&(
          <div className="w-72 flex-shrink-0 border-l border-gray-100 flex flex-col bg-gray-50">
            <div className="p-4 border-b border-gray-200 bg-white"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center"><MessageCircle size={16} className="text-white"/></div><div><p className="text-sm font-semibold text-gray-900">WhatsApp Simulator</p><p className="text-xs text-gray-400">Two-way task updates</p></div></div></div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">{whatsapp.length===0&&<p className="text-xs text-gray-400 text-center mt-8">No WhatsApp messages yet</p>}{[...whatsapp].sort((a,b)=>new Date(a.ts)-new Date(b.ts)).map(n=><div key={n.id} className={`flex ${n.direction==="received"?"justify-start":"justify-end"}`}><div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs whitespace-pre-line ${n.direction==="received"?"bg-white border border-gray-200 text-gray-800 rounded-bl-sm":"bg-green-500 text-white rounded-br-sm"}`}>{n.message}<div className={`text-right mt-0.5 text-xs ${n.direction==="received"?"text-gray-400":"text-green-100"}`}>{fmtTime(n.ts)}</div></div></div>)}</div>
            <div className="p-3 border-t border-gray-200 bg-white"><p className="text-xs text-gray-400 mb-2">Simulate employee reply:</p><div className="flex gap-2"><input value={waReply} onChange={e=>setWaReply(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendWaReply()} className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-green-400" placeholder="done / start / help..."/><button onClick={sendWaReply} className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center text-white hover:bg-green-600 flex-shrink-0"><Send size={13}/></button></div><p className="text-xs text-gray-300 mt-2">ℹ️ Real WhatsApp needs Meta Business API + backend</p></div>
          </div>
        )}
      </div>
    </div>
  );
};

function usePersistedState(key, fallback) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch { return fallback; }
  });

  // Cross-tab sync: when another tab writes to localStorage, update this tab's state
  useEffect(() => {
    const handler = (e) => {
      if (e.key === key) {
        try { setState(e.newValue ? JSON.parse(e.newValue) : fallback); } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key]);

  const setPersisted = (value) => {
    setState(prev => {
      const next = typeof value === "function" ? value(prev) : value;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  };
  return [state, setPersisted];
}

export default function App() {
  // Migration v3: clear all stale localStorage so backend becomes the single source of truth
  useEffect(() => {
    if (!localStorage.getItem("ozo_migrated_v3")) {
      ["ozo_tasks","ozo_projects","ozo_users","ozo_notifs"].forEach(k => localStorage.removeItem(k));
      localStorage.setItem("ozo_migrated_v3", "1");
    }
  }, []);

  const [currentUser, setCurrentUser] = usePersistedState("ozo_user", null);
  const [view, setView] = useState("dashboard");
  const [tasks, setTasks] = usePersistedState("ozo_tasks", []);
  const [projects, setProjects] = usePersistedState("ozo_projects", []);
  const [users, setUsers] = usePersistedState("ozo_users", []);
  const [teams, setTeams] = usePersistedState("ozo_teams", DEFAULT_TEAMS);
  const [designations, setDesignations] = usePersistedState("ozo_designations", DEFAULT_DESIGNATIONS);
  const [roles, setRoles] = usePersistedState("ozo_roles", DEFAULT_ROLES);
  const [notifications, setNotifications] = usePersistedState("ozo_notifs", []);
  const [collapsed, setCollapsed] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailTask, setDetailTask] = useState(null);

  const unreadCount = notifications.filter(n=>!n.read).length;
  const viewTitles = { dashboard:"Dashboard", tasks:"Tasks", projects:"Projects", team:"Team", notifications:"Notifications", settings:"Settings" };

  const sendEmailNotify = async (type, payload) => {
    try {
      await fetch(`${API_URL}/api/notify/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e) { console.warn("[Notify] email send failed:", e.message); }
  };

  // Backend is the single source of truth — fully replace local state from backend each sync
  const syncTasksFromBackend = async (user) => {
    if (!user?.email || !user.email.includes("@")) return;
    try {
      const isAdmin = user.role === "owner";
      const url = isAdmin
        ? `${API_URL}/api/shared/tasks/all`
        : `${API_URL}/api/shared/tasks?email=${encodeURIComponent(user.email)}`;
      const headers = isAdmin ? { "x-admin-key": ADMIN_KEY } : {};
      const res = await fetch(url, { headers });
      console.log("[sync tasks]", url, res.status);
      if (!res.ok) { console.error("[sync tasks] failed", res.status, await res.text().catch(()=>"")); return; }
      const backendTasks = await res.json();
      // Replace backend-confirmed tasks; keep locally-created ones still awaiting save
      const usersSnap = allUsers;
      const fromBackend = backendTasks.map(bt => ({
        id: bt.localId ? Number(bt.localId) : bt._id,
        backendId: bt._id,
        title: bt.title,
        description: bt.description || "",
        projectId: bt.projectId,
        assignees: (bt.assigneeEmails || []).map(email => {
          const u = usersSnap.find(u => u.email?.toLowerCase() === email.toLowerCase());
          return u ? u.id : null;
        }).filter(id => id !== null),
        assigneeEmails: bt.assigneeEmails || [],
        status: bt.status || "todo",
        priority: bt.priority || "medium",
        dueDate: bt.dueDate,
        createdBy: bt.createdBy,
        createdByName: bt.createdByName,
        type: bt.type || "individual",
        autoFollowUp: bt.autoFollowUp,
        comments: bt.comments || [],
        createdAt: bt.createdAt,
        updatedAt: bt.updatedAt,
      }));
      setTasks(prev => {
        const pending = prev.filter(t => !t.backendId); // items still being saved to backend
        const backendLocalIds = new Set(fromBackend.map(t => String(t.id)));
        const uniquePending = pending.filter(t => !backendLocalIds.has(String(t.id)));
        return [...fromBackend, ...uniquePending];
      });
    } catch {}
  };

  const syncProjectsFromBackend = async () => {
    try {
      const res = await fetch(`${API_URL}/api/shared/projects`);
      console.log("[sync projects]", res.status);
      if (!res.ok) { console.error("[sync projects] failed", res.status, await res.text().catch(()=>"")); return; }
      const backendProjects = await res.json();
      const fromBackend = backendProjects.map(bp => ({
        id: bp.localId ? Number(bp.localId) : bp._id,
        backendId: bp._id,
        name: bp.name,
        description: bp.description || "",
        emoji: bp.emoji || "📁",
        color: bp.color || "bg-blue-500",
        deadline: bp.deadline,
        owner: bp.owner,
        members: bp.members || [],
        createdAt: bp.createdAt,
      }));
      setProjects(prev => {
        const pending = prev.filter(p => !p.backendId);
        const backendLocalIds = new Set(fromBackend.map(p => String(p.id)));
        const uniquePending = pending.filter(p => !backendLocalIds.has(String(p.id)));
        return [...fromBackend, ...uniquePending];
      });
    } catch {}
  };

  const syncUsersFromBackend = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, { headers: { "x-admin-key": ADMIN_KEY } });
      if (!res.ok) return;
      const backendUsers = await res.json();
      if (!backendUsers.length) return;
      const COLORS = ["bg-blue-500","bg-pink-500","bg-green-500","bg-orange-500","bg-teal-500","bg-indigo-500"];
      setUsers(backendUsers.map((u, i) => ({
        id: u._id, backendId: u._id,
        name: u.name, email: u.email, role: u.role,
        team: u.team || "General", phone: u.phone || "",
        designation: u.designation || "", reportsTo: u.reportsTo || "",
        initials: u.initials || u.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase(),
        color: COLORS[i % COLORS.length],
        password: null,
      })));
    } catch {}
  };

  // On login: fetch fresh data then open SSE for real-time push from backend
  useEffect(() => {
    if (!currentUser) return;

    // Initial load
    syncUsersFromBackend();
    syncProjectsFromBackend();
    syncTasksFromBackend(currentUser);

    // SSE — backend pushes an event the instant any data changes
    let es = null;
    const connectSSE = () => {
      es = new EventSource(`${API_URL}/api/events`);
      es.addEventListener("tasks",    () => syncTasksFromBackend(currentUser));
      es.addEventListener("projects", () => syncProjectsFromBackend());
      es.addEventListener("users",    () => syncUsersFromBackend());
      // On error/disconnect, retry after 5s
      es.onerror = () => { es.close(); setTimeout(connectSSE, 5000); };
    };
    connectSSE();

    // Safety-net poll every 60s in case an SSE event is missed
    const poll = setInterval(() => {
      syncTasksFromBackend(currentUser);
      syncProjectsFromBackend();
      syncUsersFromBackend();
    }, 60000);

    return () => { if (es) es.close(); clearInterval(poll); };
  }, [currentUser?.id]);

  const handleCreateTask = async (form) => {
    const localId = Date.now();
    const assigneeUsers = form.assignees.map(id => getUserById(id, allUsers)).filter(Boolean);
    const assigneeEmails = assigneeUsers.map(u => u.email?.toLowerCase()).filter(e => e?.includes("@"));

    const newTask = {
      id: localId, ...form,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      status: "todo", comments: [],
    };
    setTasks(prev => [...prev, newTask]);

    // Push to backend — get backendId back and stamp it to avoid future duplicates
    try {
      const res = await fetch(`${API_URL}/api/shared/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
        body: JSON.stringify({
          localId, title: form.title, description: form.description,
          projectId: form.projectId, assigneeIds: form.assignees,
          assigneeEmails,
          status: "todo", priority: form.priority, type: form.type,
          dueDate: form.dueDate, autoFollowUp: form.autoFollowUp,
          createdBy: currentUser.id, createdByName: currentUser.name,
          createdByEmail: currentUser.email?.toLowerCase(),
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        console.log("[create task] saved to backend", saved._id);
        setTasks(prev => prev.map(t => t.id === localId ? { ...t, backendId: saved._id } : t));
      } else {
        console.error("[create task] backend save failed", res.status, await res.text().catch(()=>""));
      }
    } catch (e) { console.error("[create task] error", e.message); }

    const ts = new Date().toISOString();
    const proj = projects.find(p=>p.id===form.projectId);

    // Send real emails
    sendEmailNotify("task-assigned", {
      task: { ...form, id: newTask.id },
      assignees: assigneeUsers.filter(u=>u.email&&u.email.includes("@")).map(u=>({ name:u.name, email:u.email })),
      assignedBy: { name: currentUser.name },
      project: proj ? { name: proj.name, emoji: proj.emoji } : null,
    });

    // In-app notifications
    assigneeUsers.forEach(u => {
      setNotifications(prev=>[...prev,{id:Date.now()+Math.random(),type:"email",taskId:newTask.id,toUser:u.id,subject:`New Task Assigned: ${form.title}`,body:`Hi ${u.name}, you've been assigned '${form.title}'${proj?` on ${proj.name}`:""}.`,ts,read:false,direction:"sent"}]);
      setNotifications(prev=>[...prev,{id:Date.now()+Math.random(),type:"whatsapp",taskId:newTask.id,toUser:u.id,message:`📋 *New Task Assigned*\n\nHi ${u.name}!\n*${form.title}*\n📅 Due: ${fmtDate(form.dueDate)}\n\nReply: ✅ done | ▶️ start | ❓ help`,ts,read:false,direction:"sent",status:"delivered"}]);
    });
  };

  const handleUpdateTask = (taskId, updates) => {
    setTasks(prev=>prev.map(t=>t.id===taskId?{...t,...updates,updatedAt:new Date().toISOString().split("T")[0]}:t));
    if (detailTask?.id===taskId) setDetailTask(prev=>({...prev,...updates}));

    // Push update to backend so all devices see the new status/comments
    const task = tasks.find(t=>t.id===taskId);
    if (task?.backendId) {
      fetch(`${API_URL}/api/shared/tasks/${task.backendId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
        body: JSON.stringify(updates),
      }).catch(()=>{});
    }

    // Send "task completed" email to the creator when status → done
    if (updates.status === "done") {
      if (task) {
        const creator = getUserById(task.createdBy, allUsers);
        if (creator && creator.email && creator.email.includes("@")) {
          sendEmailNotify("task-completed", {
            task: { title: task.title },
            completedBy: { name: currentUser.name },
            notifyUsers: [{ name: creator.name, email: creator.email }],
          });
        }
      }
    }
  };

  const handleCreateProject = async (form) => {
    const localId = Date.now();
    const newProj = { id: localId, ...form };
    setProjects(prev => [...prev, newProj]);
    try {
      const res = await fetch(`${API_URL}/api/shared/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
        body: JSON.stringify({ localId, ...form, owner: currentUser.id }),
      });
      if (res.ok) {
        const saved = await res.json();
        console.log("[create project] saved to backend", saved._id);
        setProjects(prev => prev.map(p => p.id === localId ? { ...p, backendId: saved._id } : p));
      } else {
        console.error("[create project] backend save failed", res.status, await res.text().catch(()=>""));
      }
    } catch (e) { console.error("[create project] error", e.message); }
  };
  const handleEditProject = async (projectId, form) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...form } : p));
    const proj = projects.find(p => p.id === projectId);
    if (proj?.backendId) {
      try {
        await fetch(`${API_URL}/api/shared/projects/${proj.backendId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
          body: JSON.stringify(form),
        });
      } catch {}
    }
  };
  const handleDeleteProject = async (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setTasks(prev => prev.filter(t => t.projectId !== projectId));
    const proj = projects.find(p => p.id === projectId);
    if (proj?.backendId) {
      try {
        await fetch(`${API_URL}/api/shared/projects/${proj.backendId}`, {
          method: "DELETE",
          headers: { "x-admin-key": ADMIN_KEY },
        });
      } catch {}
    }
  };

  const allUsers = [ADMIN_USER, ...users];

  if (!currentUser) return <LoginPage
    onLogin={u=>{setCurrentUser(u);setView("dashboard");}}
    users={users}
    onSyncUsers={backendUsers => setUsers(prev => {
      const existingEmails = new Set(prev.map(u => u.email.toLowerCase()));
      const newOnes = backendUsers.filter(u => !existingEmails.has(u.email.toLowerCase()));
      return newOnes.length ? [...prev, ...newOnes] : prev;
    })}
  />;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar currentUser={currentUser} view={view} setView={setView} unreadCount={unreadCount} collapsed={collapsed} setCollapsed={setCollapsed}/>
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header title={viewTitles[view]} currentUser={currentUser} onLogout={()=>{
          // Clear all cached data so the next browser session fetches fresh from backend
          ["ozo_user","ozo_tasks","ozo_projects","ozo_users","ozo_notifs"].forEach(k => localStorage.removeItem(k));
          setTasks([]); setProjects([]); setUsers([]); setCurrentUser(null);
        }} onCollapse={()=>setCollapsed(c=>!c)}/>
        {view==="dashboard"&&<DashboardView currentUser={currentUser} tasks={tasks} projects={projects} notifications={notifications} setView={setView} openCreateTask={()=>setCreateOpen(true)}/>}
        {view==="tasks"&&<TasksView currentUser={currentUser} tasks={tasks} projects={projects} users={allUsers} openCreateTask={()=>setCreateOpen(true)} openTaskDetail={setDetailTask}/>}
        {view==="projects"&&<ProjectsView projects={projects} tasks={tasks} users={allUsers} currentUser={currentUser} onCreateProject={handleCreateProject} onEditProject={handleEditProject} onDeleteProject={handleDeleteProject}/>}
        {view==="team"&&<TeamView users={users} setUsers={setUsers} tasks={tasks} currentUser={currentUser} teams={teams} designations={designations} roles={roles}/>}
        {view==="notifications"&&<NotificationsView notifications={notifications} setNotifications={setNotifications} tasks={tasks} users={allUsers} currentUser={currentUser}/>}
        {view==="settings"&&<SettingsView teams={teams} setTeams={setTeams} designations={designations} setDesignations={setDesignations} roles={roles} setRoles={setRoles}/>}
      </div>
      <CreateTaskModal open={createOpen} onClose={()=>setCreateOpen(false)} currentUser={currentUser} projects={projects} users={allUsers} onSubmit={handleCreateTask}/>
      <TaskDetailModal open={!!detailTask} onClose={()=>setDetailTask(null)} task={detailTask} projects={projects} users={allUsers} currentUser={currentUser} onUpdate={handleUpdateTask} onDelete={(id)=>{
        const t = tasks.find(x=>x.id===id);
        setTasks(prev=>prev.filter(t=>t.id!==id));
        setDetailTask(null);
        if (t?.backendId) fetch(`${API_URL}/api/shared/tasks/${t.backendId}`,{method:"DELETE",headers:{"x-admin-key":ADMIN_KEY}}).catch(()=>{});
      }}/>
    </div>
  );
}
