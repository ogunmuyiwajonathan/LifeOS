export default function CardWrapper({ icon, title, badge, children }) {
  return (
    <div className="rounded-2xl bg-[#0f1a13] border border-[#1e3028] p-5 max-h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#052e16] flex items-center justify-center">
            {icon}
          </div>
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        {badge && <div className="text-[#059669] text-sm">{badge}</div>}
      </div>
      <div className="overflow-y-auto hide-scrollbar min-h-0 flex-1">{children}</div>
    </div>
  )
}
