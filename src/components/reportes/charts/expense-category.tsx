export default function ExpenseCategory({
  budgetData,
  currency,
}: {
  budgetData: any[];
  currency: string;
}) {
  return (
    <div className="glass-panel p-6 md:p-8 rounded-3xl animate-fade-in shadow-xl shadow-black/20">
      <h3 className="text-lg font-bold text-white mb-6">
        Gasto por Categoría (Mes Actual)
      </h3>
      <div className="space-y-5">
        {budgetData.length > 0 ? (
          budgetData.map((item) => {
            const progress = (item.spent / item.budget) * 100;
            const isOver = progress > 100;
            return (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-bold ${isOver ? "text-rose-400" : "text-slate-300"}`}
                    >
                      {currency} {item.spent.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500">
                      estimado {currency} {item.budget}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: item.color,
                      boxShadow: `0 0 8px ${item.color}60`,
                    }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-slate-500 text-center py-4">
            No hay gastos registrados este mes.
          </p>
        )}
      </div>
    </div>
  );
}
