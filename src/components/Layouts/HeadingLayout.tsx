import AddNewButton from "../UI/Button/AddNewButton";

interface HeadingLayoutProps {
  title: string;
  description?: string;
  showAddButton?: boolean;
  handleAddClick?: () => void;
}

export default function HeadingLayout({
  title,
  description,
  showAddButton = false,
  handleAddClick = () => {},
}: HeadingLayoutProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <h1 className="text-xl font-medium text-violet-500">{title}</h1>
        {description && <small className="text-slate-500">{description}</small>}
      </div>
      <div className="">
        {showAddButton && <AddNewButton onClick={handleAddClick} />}
      </div>
    </div>
  );
}
