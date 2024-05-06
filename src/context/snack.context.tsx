"use client";
import { cn } from "@/utils/helper.util";
import {
  CheckCircleOutlined,
  CloseOutlined,
  InfoCircleFilled,
  WarningOutlined,
} from "@ant-design/icons";
import { createContext, useState } from "react";
import { createPortal } from "react-dom";

export type SnackSType = "success" | "info" | "warning" | "error";

export type SnackT = {
  show: boolean;
  timing: number;
  text: string;
  type: SnackSType;
};

interface InitialStateI {
  snack: SnackT[];
  showSnack: (msg: string, type: SnackSType) => void;
}

const initialState: InitialStateI = {
  snack: [
    {
      show: false,
      type: "success",
      text: "",
      timing: 5000,
    },
  ],
  showSnack: () => {},
};

export const SnackContext = createContext<InitialStateI>(initialState);

const getSnackTypeColor = (type: SnackSType) => {
  switch (type) {
    case "info":
      return "bg-indigo-500";
    case "warning":
      return "bg-amber-500";
    case "success":
      return "bg-emerald-500";
    case "error":
      return "bg-red-400";
    default:
      return "bg-emerald-500";
  }
};

export const SnackContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [snack, setSnack] = useState<SnackT[]>([]);

  const showSnack = (text: string, type: SnackSType, timing: number = 4000) => {
    setSnack([
      {
        ...snack,
        show: true,
        text,
        type,
        timing,
      },
    ]);
    setTimeout(() => {
      setSnack([]);
    }, timing);
  };

  const hideSnackbar = () => {
    setSnack([]);
  };

  return (
    <SnackContext.Provider value={{ snack, showSnack }}>
      {children}
      {snack.map((sn) => (
        <SnackBar key={sn.text} sn={sn} hideSnackbar={hideSnackbar} />
      ))}
    </SnackContext.Provider>
  );
};

interface SnackBarProps {
  sn: SnackT;
  hideSnackbar: () => void;
}

export function SnackBar({ sn, hideSnackbar = () => {} }: SnackBarProps) {
  return (
    <div
      className={cn(
        `border-1 animation-model shadow-m fixed right-2 top-5
           z-10 max-w-[350px] rounded-2xl px-4 py-3 transition-all`,
        getSnackTypeColor(sn.type),
      )}
    >
      <div className="flex items-center justify-evenly gap-3 text-sm text-white">
        {sn.type === "info" && <InfoCircleFilled className="text-lg" />}
        {sn.type === "success" && <CheckCircleOutlined className="text-lg" />}
        {sn.type === "warning" && <WarningOutlined className="text-lg" />}

        <span>{sn.text}</span>
        <span role="button" onClick={hideSnackbar} className="hover:scale-125">
          <CloseOutlined className="text-md flex font-extrabold" />
        </span>
      </div>
    </div>
  );
}
