import React from "react";

interface ReadOnlyLayoutProps {
  label: string;
  value: string;
}

export default function ReadOnlyLayout({ label, value }: ReadOnlyLayoutProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-sm">{label}</div>
      <div className="text-sm text-slate-500">{value}</div>
    </div>
  );
}
