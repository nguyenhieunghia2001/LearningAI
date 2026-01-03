import "./App.css";
import { useState } from 'react';
import Header from "./components/Header";
import CSharpInterview from "./pages/CSharpInterview";

function App() {
  const [selected, setSelected] = useState('fundamentals');

  return (
    <>
      <Header selectedKey={selected} onMenuClick={setSelected} />
      <CSharpInterview selected={selected} />
    </>
  );
}

export default App;
