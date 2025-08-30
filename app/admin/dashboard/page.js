// app/admin/dashboard/page.jsx

export default function AdminDashboardHome() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Welcome to Admin Dashboard</h1>
      <p className="text-gray-600 text-lg">
        Use the sidebar to navigate between Users, Deposits, Withdraws, Transactions, and Reports.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        <div className="bg-white shadow rounded p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <span className="text-3xl font-bold mt-2">0</span>
        </div>

        <div className="bg-white shadow rounded p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold">Pending Deposits</h2>
          <span className="text-3xl font-bold mt-2">0</span>
        </div>

        <div className="bg-white shadow rounded p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold">Pending Withdraws</h2>
          <span className="text-3xl font-bold mt-2">0</span>
        </div>
      </div>
    </div>
  );
}
