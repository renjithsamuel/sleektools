import { AdminDashboard } from '../../components/Admin/AdminDashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - SleekTools',
  description: 'Manage tools, monitor usage, and system health',
  robots: 'noindex, nofollow',
};

export default function AdminPage() {
  return <AdminDashboard />;
}
