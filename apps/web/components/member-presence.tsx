const members = [
  { id: 1, name: "Alice", color: "bg-rose-500" },
  { id: 2, name: "Ben", color: "bg-sky-500" },
  { id: 3, name: "Cora", color: "bg-violet-500" },
  { id: 4, name: "Drew", color: "bg-emerald-500" },
];

export function MemberPresence() {
  return (
    <div className="flex items-center gap-3">
      {members.map((member) => (
        <div key={member.id} className="group relative flex items-center">
          <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white ${member.color}`}>
            {member.name.slice(0, 1)}
          </div>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-[10px] text-white opacity-0 transition group-hover:opacity-100">
            {member.name}
          </span>
        </div>
      ))}
    </div>
  );
}
