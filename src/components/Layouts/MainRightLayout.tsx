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
    <div className="relative flex w-[40%] flex-col gap-2 [height:calc(100vh-25px)]">
      {children}
    </div>
  );
};

MainRightLayout.Separator = function () {
  return (
    <div className="relative w-0.5 rounded-full bg-violet-300 [height:calc(100vh-0px)]">
      <span className="absolute -left-2 top-[50%] flex items-center bg-white">
        <RightCircleOutlined className="z-20 [&>svg]:fill-violet-400" />
      </span>
    </div>
  );
};

MainRightLayout.Right = function ({ children }: { children: React.ReactNode }) {
  return (
    <div className="scrollbar-thin flex w-[60%] items-start justify-center overflow-y-auto p-2 [height:calc(100vh-15px)]">
      {children}
    </div>
  );
};

export default MainRightLayout;
