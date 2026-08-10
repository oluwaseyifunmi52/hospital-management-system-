import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth.service';
import { User, Bell, Shield, Palette, Loader2 } from 'lucide-react';
import { ComponentType } from 'react';
import toast from 'react-hot-toast';

type Tab = 'profile' | 'notifications' | 'security' | 'appearance';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(8, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export function Settings() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isSaving, setIsSaving] = useState(false);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const tabs: { id: Tab; label: string; icon: ComponentType<{ className?: string }> }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const handleProfileSubmit = async (data: ProfileForm) => {
    setIsSaving(true);
    try {
      await authService.updateProfile(data);
      const updatedUser = { ...user!, ...data };
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (data: PasswordForm) => {
    setIsSaving(true);
    try {
      await authService.changePassword(data.currentPassword, data.newPassword);
      toast.success('Password changed successfully');
      passwordForm.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

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
            <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900">Profile Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name</label>
                  <input
                    {...profileForm.register('firstName')}
                    className={`input ${profileForm.formState.errors.firstName ? 'input-error' : ''}`}
                  />
                  {profileForm.formState.errors.firstName && (
                    <p className="mt-1 text-sm text-danger-600">{profileForm.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input
                    {...profileForm.register('lastName')}
                    className={`input ${profileForm.formState.errors.lastName ? 'input-error' : ''}`}
                  />
                  {profileForm.formState.errors.lastName && (
                    <p className="mt-1 text-sm text-danger-600">{profileForm.formState.errors.lastName.message}</p>
                  )}
                </div>
                <div>
                  <label className="label">Email</label>
                  <input className="input" value={user?.email} disabled />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input
                    {...profileForm.register('phone')}
                    className={`input ${profileForm.formState.errors.phone ? 'input-error' : ''}`}
                  />
                  {profileForm.formState.errors.phone && (
                    <p className="mt-1 text-sm text-danger-600">{profileForm.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" className="btn-primary" disabled={isSaving}>
                  {isSaving ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </span>
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900">Notifications</h3>
              <p className="text-secondary-500 text-sm mb-4">
                Notification preferences are managed in the mobile app settings.
              </p>
              <div className="space-y-3">
                {['Email notifications', 'SMS notifications', 'Push notifications', 'Appointment reminders'].map((item) => (
                  <label key={item} className="flex items-center justify-between p-3 rounded-lg border border-secondary-200 cursor-pointer hover:bg-secondary-50">
                    <span className="text-sm font-medium text-secondary-700">{item}</span>
                    <input type="checkbox" defaultChecked className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500" disabled />
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900">Security</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Current Password</label>
                  <input
                    {...passwordForm.register('currentPassword')}
                    type="password"
                    className={`input ${passwordForm.formState.errors.currentPassword ? 'input-error' : ''}`}
                    placeholder="••••••••"
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="mt-1 text-sm text-danger-600">{passwordForm.formState.errors.currentPassword.message}</p>
                  )}
                </div>
                <div>
                  <label className="label">New Password</label>
                  <input
                    {...passwordForm.register('newPassword')}
                    type="password"
                    className={`input ${passwordForm.formState.errors.newPassword ? 'input-error' : ''}`}
                    placeholder="••••••••"
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="mt-1 text-sm text-danger-600">{passwordForm.formState.errors.newPassword.message}</p>
                  )}
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <input
                    {...passwordForm.register('confirmPassword')}
                    type="password"
                    className={`input ${passwordForm.formState.errors.confirmPassword ? 'input-error' : ''}`}
                    placeholder="••••••••"
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-danger-600">{passwordForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                <button type="submit" className="btn-primary" disabled={isSaving}>
                  {isSaving ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </span>
                  ) : 'Update Password'}
                </button>
              </div>
            </form>
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