import { AppstoreOutlined } from "@ant-design/icons";

interface NoSelectionLayoutI {
  text?: string;
}

export default function NoSelectionLayout({
  text = "No selection",
}: NoSelectionLayoutI) {
  return (
    <div className="flex flex-col gap-4">
      <AppstoreOutlined
        style={{ fontSize: 45 }}
        className="[&>svg]:fill-violet-500"
      />
      <span className="text-lg">{text}</span>
    </div>
  );
}
