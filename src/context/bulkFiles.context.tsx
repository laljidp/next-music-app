import React, { useState } from "react";

interface InitialStateFileT {
  file: File[];
  loading: boolean;
  progress: number;
}

const initialFileState: InitialStateFileT = {
  file: [],
  loading: false,
  progress: 0,
};

const FileContext = React.createContext({
  file: [],
  loading: false,
  progress: 0,
});

const BulkFileContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [file, setFile] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  return (
    <FileContext.Provider value={{ file, loading, progress }}>
      {children}
    </FileContext.Provider>
  );
};

export default BulkFileContextProvider;
