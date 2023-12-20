"use client";
import {
  CheckCircleOutlined,
  CloseOutlined,
  InfoCircleFilled,
  WarningOutlined,
} from "@ant-design/icons";
import { createContext, useState } from "react";

export type SnackSType = "success" | "info" | "warning";

export type SnackT = {
  show: boolean;
  timing: number;
  text: string;
  type: SnackSType;
};

interface InitialStateI {
  snack: SnackT;
  showSnack: (msg: string, type: SnackSType) => void;
}

const initialState: InitialStateI = {
  snack: {
    show: true,
    type: "success",
    text: "",
    timing: 3000,
  },
  showSnack: () => {},
};

export const SnackContext = createContext<InitialStateI>(initialState);

export const SnackContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [snack, setSnack] = useState(initialState.snack);

  const showSnack = (text: string, type: SnackSType, timing: number = 4000) => {
    setSnack({
      ...snack,
      show: true,
      text,
      type,
      timing,
    });
    setTimeout(() => {
      setSnack(initialState.snack);
    }, timing);
  };

  const hideSnackbar = () => {
    console.log("Calling hide snackbar");
    setSnack({ ...initialState.snack, show: false });
  };

  const getSnackTypeColor = (type: SnackSType) => {
    switch (type) {
      case "info":
        return "bg-indigo-500";
      case "warning":
        return "bg-amber-500";
      case "success":
        return "bg-emerald-500";
      default:
        return "bg-emerald-500";
    }
  };

  const closeSnackbar = () => {
    setSnack(initialState.snack);
  };

  return (
    <SnackContext.Provider value={{ snack, showSnack }}>
      {children}
      {snack.show && snack.text && (
        <div
          className={`fixed top-2 left-[45%] translate-X-[-50%] border-1 border-solid rounded-2xl px-4 py-2
           anim-scale-down ${getSnackTypeColor(snack.type)}`}
        >
          <div className="text-white text-sm flex justify-evenly items-center gap-3">
            {snack.type === "info" && <InfoCircleFilled />}
            {snack.type === "success" && <CheckCircleOutlined />}
            {snack.type === "warning" && <WarningOutlined />}

            <span>{snack.text}</span>
            <span
              role="button"
              onClick={hideSnackbar}
              className="hover:scale-125"
            >
              <CloseOutlined className="font-medium [&>svg]:text-xs [&>svg]:flex" />
            </span>
          </div>
        </div>
      )}
      <div></div>
    </SnackContext.Provider>
  );
};
