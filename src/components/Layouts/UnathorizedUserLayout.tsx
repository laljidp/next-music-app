import { StopOutlined } from "@ant-design/icons";

export default function UnauthorizedUserLayout() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col justify-center gap-2 rounded-md p-4 ring-1 ring-red-400">
        <StopOutlined className="text-4xl text-red-400" />
        <div className="text-md text-red-400">
          You're not allowed to access the page.
        </div>
      </div>
    </div>
  );
}
