import useClickOutside from "@/hooks/useClickOutside";
import { cn } from "@/utils/helper.util";
import { CloseCircleFilled } from "@ant-design/icons";
import { useRef } from "react";
import { createPortal } from "react-dom";

export enum ModelSize {
  SM = "sm",
  MD = "md",
  XL = "xl",
  FULL = "full",
  NONE = "none",
}

interface TWModalProps {
  children: React.ReactNode;
  size?: ModelSize;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  allowBackdrop?: boolean;
}

const sizeClasses: Record<ModelSize, string> = {
  sm: "max-h-[320px] w-[320px]",
  md: "max-h-[450px] w-[650px]",
  xl: "max-h-[510px] w-[600px]",
  full: "h-screen w-screen",
  none: "",
};

export default function TWModal(props: TWModalProps) {
  const {
    isOpen,
    onClose,
    size = ModelSize.NONE,
    className = "",
    allowBackdrop = false,
  } = props;
  const sectionRef = useRef(null);

  useClickOutside(sectionRef, () => {
    allowBackdrop && onClose();
  });

  const classes = sizeClasses[size];

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`animation-model absolute left-0 top-0 z-20 h-screen w-screen
           overflow-hidden border-2 bg-transparent backdrop-blur-sm`}
    >
      <div className="relative h-full w-full">
        <div
          ref={sectionRef}
          className={cn(
            `absolute left-[50%] top-[40%] -translate-x-[50%] -translate-y-[50%] transform rounded-lg border-2
           border-violet-300 bg-white p-2 shadow-lg`,
            classes,
            className,
          )}
          id="tw-model"
        >
          <div
            className="absolute right-1 top-0 flex items-center justify-center
               rounded-xl p-1 text-center hover:scale-125"
            role="button"
            onClick={onClose}
          >
            <CloseCircleFilled className="text-lg text-violet-500" />
          </div>
          <div className="px-4 py-5" id="modal-body">
            {props.children}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
