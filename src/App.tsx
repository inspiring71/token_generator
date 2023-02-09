import { ReactElement, useMemo, useState } from "react";
import "./App.scss";
import SendToken from "./SendToken/SendToken";
import GetToken from "./GetToken/GetToken";

const pages = {
  "send-token": SendToken,
  "see-tokens": GetToken,
};
const getPage = (page: keyof typeof pages, navigator: ReactElement) => {
  const Component = pages[page];
  return <Component navigator={navigator}/>;
};

function App() {
  const pageButtons = useMemo(() => {
    return (
      <div>
        <button type="button" className="" onClick={() => setPage("send-token")}>
          Shar your tokens
        </button>
        <button type="button" onClick={() => setPage("see-tokens")}>
          Get token list from server
        </button>
      </div>
    );
  }, []);
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
      <div className="content">{getPage(page,pageButtons)}</div>
    </div>
  );
}

export default App;
