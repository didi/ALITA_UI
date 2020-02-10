import React, { useState } from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";

const App: React.FC = () => {
  const [code, setCode] = useState("// code");
  const updateCode = (newCode: string) => {
    setCode(newCode);
  };
  return (
    <div className="App">
      <CodeMirror
        value={code}
        options={{
          mode: "javascript",
          theme: "material",
          lineNumbers: true
        }}
        onChange={(editor, data, value) => {
          updateCode(value);
        }}
        onBeforeChange={() => {}}
      />
    </div>
  );
};

export default App;
