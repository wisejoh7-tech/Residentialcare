import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { RoleSwitcher } from './components/Security/RoleSwitcher';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ResidentList } from './components/Residents/ResidentList';
import { TaskList } from './components/Tasks/TaskList';
import { CarePlanManager } from './components/CarePlans/CarePlanManager';
import { StaffRoster } from './components/Staff/StaffRoster';
import { ReportsView } from './components/Reports/ReportsView';
import { FamilyPortal } from './components/Family/FamilyPortal';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Activity,
  UserCheck,
  BarChart3,
  Heart,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';

export function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedResidentId, setSelectedResidentId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (view: string, residentId?: string) => {
    setActiveTab(view);
    if (residentId !== undefined) {
      setSelectedResidentId(residentId);
    }
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'residents', label: 'Residents', icon: Users },
    { id: 'tasks', label: "Today's To-Dos", icon: CheckSquare },
    { id: 'careplans', label: 'Care Plans', icon: Activity },
    { id: 'staff', label: 'Team & Roster', icon: UserCheck },
    { id: 'reports', label: 'Reports & Audits', icon: BarChart3 },
    { id: 'family', label: 'Family Feed', icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Top Security & Role Switcher Banner */}
      <RoleSwitcher />

      {/* Main Purple Header / Navigation Bar matching "Log my Care" Screenshot */}
      <header className="bg-purple-900 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Brand */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => handleNavigate('dashboard')}
            >
              <div className="w-9 h-9 rounded-xl bg-purple-700 border border-purple-500 flex items-center justify-center text-white shadow-xs">
                <Heart className="w-5 h-5 fill-white text-purple-900" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
                  Log my Care
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] bg-purple-800 text-purple-200 px-2 py-0.5 rounded-full font-semibold border border-purple-700">
                  Digital Care Platform
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-purple-800 text-white shadow-xs border border-purple-600/50'
                        : 'text-purple-200 hover:text-white hover:bg-purple-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-purple-200 hover:text-white hover:bg-purple-800 focus:outline-none"
                aria-label="Toggle Mobile Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-purple-950 border-b border-purple-800 px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
                    isActive
                      ? 'bg-purple-800 text-white font-bold'
                      : 'text-purple-200 hover:bg-purple-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}

        {activeTab === 'residents' && (
          <ResidentList
            selectedResidentId={selectedResidentId}
            onSelectResident={(id) => setSelectedResidentId(id)}
          />
        )}

        {activeTab === 'tasks' && <TaskList />}

        {activeTab === 'careplans' && <CarePlanManager />}

        {activeTab === 'staff' && <StaffRoster />}

        {activeTab === 'reports' && <ReportsView />}

        {activeTab === 'family' && <FamilyPortal />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Log my Care Systems. CQC & NHS Compliance Enabled.</p>

          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-700" />
              <span>RBAC Encrypted</span>
            </span>
            <span>•</span>
            <span>WCAG 2.1 AA Accessible</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
