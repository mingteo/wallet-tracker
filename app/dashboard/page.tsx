export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <button className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:brightness-110 transition-all shadow-lg shadow-brand-primary/20">
          + Add Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder Cards */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass-panel p-6 rounded-2xl h-32 flex flex-col justify-between"
          >
            <h3 className="text-text-secondary text-sm font-medium">
              Total Balance
            </h3>
            <p className="text-2xl font-bold text-white">$12,450.00</p>
          </div>
        ))}
      </div>

      <div className="glass-panel p-6 rounded-2xl h-96 flex items-center justify-center text-text-muted">
        Chart Area (Will implement Recharts here)
      </div>
    </div>
  );
}
