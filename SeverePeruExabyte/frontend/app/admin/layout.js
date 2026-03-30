export const metadata = {
  title: 'Admin — Rym SHOES',
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {children}
    </div>
  );
}
