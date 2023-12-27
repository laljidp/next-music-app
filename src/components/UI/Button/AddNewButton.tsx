import { PlusOutlined } from "@ant-design/icons";
import { TWButton } from ".";

interface AddNewButtonProps {
  onClick: () => void;
}

export default function AddNewButton({
  onClick = () => {},
}: AddNewButtonProps) {
  return (
    <TWButton
      onClick={onClick}
      type="button"
      className="w-8 h-8 flex"
      variant="outline"
    >
      <PlusOutlined className="font-bold text-md" />
    </TWButton>
  );
}
