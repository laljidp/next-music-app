export default function ListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="overflow-auto scrollbar-hide h-[calc(100vh-15px)]
        shadow-lg rounded-xl animation-scale-up-tl"
    >
      {children}
    </div>
  );
}
