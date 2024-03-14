export enum ModelSize {
  SM = "sm",
  MD = "md",
  XL = "xl",
  FULL = "full",
}

interface TWModalProps {
  children: React.ReactNode;
  size?: ModelSize;
  isOpen: boolean;
  onClose: () => void;
}

const sizeClasses: Record<ModelSize, string> = {
  sm: "h-[320px] w-[320px]",
  md: "h-[450px] w-[650px]",
  xl: "h-[510px] w-[600px]",
  full: "h-screen w-screen",
};

export default function TWModal(props: TWModalProps) {
  const { isOpen, onClose, size = ModelSize.MD } = props;

  const classes = sizeClasses[size];

  if (!isOpen) return null;

  return (
    <div
      className={`absolute top-0 left-0 border-2 bg-transparent backdrop-blur-sm z-20
           animation-scale-up-tl overflow-hidden ring-1 ring-violet-400 h-screen w-screen`}
    >
      <div className="relative h-full w-full">
        <div
          className={`${classes} border-2 border-violet-300 absolute bg-white p-2 transform top-[40%] left-[50%]
           -translate-y-[50%] -translate-x-[50%] rounded-md shadow-md`}
          id="tw-model"
        >
          <div className="relative">
            <div
              className="absolute right-1 justify-center text-gray-500 bg-violet-50 hover:bg-violet-200
               text-center flex w-[2rem] items-center p-1 rounded-xl"
              role="button"
              onClick={onClose}
            >
              x
            </div>
            <div className="" id="modal-body">
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
