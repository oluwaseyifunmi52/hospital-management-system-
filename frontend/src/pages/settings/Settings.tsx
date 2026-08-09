import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, Bell, Shield, Palette } from 'lucide-react';
import { ComponentType } from 'react';

type Tab = 'profile' | 'notifications' | 'security' | 'appearance';

export function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const tabs: { id: Tab; label: string; icon: ComponentType<{ className?: string }> }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account preferences</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <nav className="sm:w-48 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-secondary-600 hover:bg-secondary-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 card p-6">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900">Profile Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name</label>
                  <input className="input" defaultValue={user?.firstName} />
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input className="input" defaultValue={user?.lastName} />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input className="input" defaultValue={user?.email} disabled />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input className="input" defaultValue={user?.phone} />
                </div>
              </div>
              <div className="pt-4">
                <button className="btn-primary">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900">Notifications</h3>
              <div className="space-y-3">
                {['Email notifications', 'SMS notifications', 'Push notifications', 'Appointment reminders'].map((item) => (
                  <label key={item} className="flex items-center justify-between p-3 rounded-lg border border-secondary-200 cursor-pointer hover:bg-secondary-50">
                    <span className="text-sm font-medium text-secondary-700">{item}</span>
                    <input type="checkbox" defaultChecked className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500" />
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900">Security</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Current Password</label>
                  <input type="password" className="input" placeholder="••••••••" />
                </div>
                <div>
                  <label className="label">New Password</label>
                  <input type="password" className="input" placeholder="••••••••" />
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <input type="password" className="input" placeholder="••••••••" />
                </div>
                <button className="btn-primary">Update Password</button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900">Appearance</h3>
              <p className="text-secondary-500">Theme preferences are managed in the top bar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
