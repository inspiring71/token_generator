import { useState } from "react";
import "./App.scss";
import SendToken from "./SendToken/SendToken";
import GetToken from "./GetToken/GetToken";

const pages = {
  "send-token": <SendToken />,
  "see-tokens": <GetToken />,
};

function App() {
  const [page, setPage] = useState<keyof typeof pages>("see-tokens");
  return (
    <div className="App">
      <div className="top-menu">
        <div>
          <a href="#" onClick={() => setPage("send-token")}>
            Share Your Token
          </a>
        </div>
        <div>
          <a href="#" onClick={() => setPage("see-tokens")}>
            Get Token List
          </a>
        </div>
      </div>
      <div className="content">
        {pages[page]}
      </div>
    </div>
  );
}

export default App;
