import { RightCircleOutlined } from "@ant-design/icons";

interface MainRightLayoutProps {
  children: React.ReactNode;
}

function MainRightLayout(props: MainRightLayoutProps) {
  return (
    <div className="flex items-start justify-between gap-5">
      {props.children}
    </div>
  );
}

MainRightLayout.Left = function ({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[40%] flex flex-col gap-2 h-full relative">
      {children}
    </div>
  );
};

MainRightLayout.Separator = function () {
  return (
    <div className="w-0.5 bg-violet-300 relative rounded-full h-[calc(100vh-150px)]">
      <span className="absolute top-[50%] -left-2 bg-white flex items-center">
        <RightCircleOutlined className="[&>svg]:fill-violet-400 z-20" />
      </span>
    </div>
  );
};

MainRightLayout.Right = function ({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[60%] flex items-center justify-center px-8">
      {children}
    </div>
  );
};

export default MainRightLayout;
