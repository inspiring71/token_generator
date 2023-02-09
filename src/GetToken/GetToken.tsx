import React, { ReactElement, useCallback, useMemo, useState } from "react";
import styles from "./GetToken.module.scss";
// import { useMutation } from "react-query";
function unsecuredCopyToClipboard(text:string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Unable to copy to clipboard', err);
  }
  document.body.removeChild(textArea);
}
function GetToken({navigator:navBtns}: {navigator: ReactElement}) {
  let [forminfo, setFormInfo] = useState({
    passcode: "",
  });
  const [saveResult, setSaveResult] = useState<ReactElement | null>(null);
  // use react query to send post request to server
  const copyText = useCallback((tokenList: Array<Array<string>>) => {
    let text = `tokenList=[${tokenList
      .map((token) => `("${token[0]}":"${token[1]}")`)
      .join(",")}]`;
    try{
      navigator.clipboard.writeText(text);
    }catch(e){
      unsecuredCopyToClipboard(text);
    }
    alert("text copied to clipboard!");
  }, []);
  const saveToServer = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      // Assign a loading
      setSaveResult(
        <div id="myModal" className={styles.modal}>
          <div className={styles["modal-content"]}>
            <img src="img.svg" alt="loading" />
          </div>
        </div>
      );
      const response = await fetch(
        "https://eakxumvlet77rtusg5b7ji5wvi0ufhtd.lambda-url.us-east-2.on.aws/?" +
          new URLSearchParams({
            passcode: forminfo["passcode"],
          }),
        {
          method: "GET",
        }
      );
      if (response.ok) {
        let tokenList: Array<Array<string>> = await response.json();
        setSaveResult(
          <div className={styles.success}>
            Here is the token list for your code:
            <pre style={{ overflow: "scroll" }}>
              tokenList=[
              {tokenList
                .map((token) => `("${token[0]}":"${token[1]}")`)
                .join(",")}
              ]
            </pre>
            <input type="button" onClick={() => copyText(tokenList)} value="Copy The code" />
            For more information and sample code please visit SWAG github.
          </div>
        );
      } else {
        let errorMsg = JSON.parse(await response.text());
        setSaveResult(
          <div className={styles.error}>
            <p>
              Something went wrong. We got this message from server:
              <ul>
                <li>{errorMsg["message"]}</li>
              </ul>
            </p>
          </div>
        );
      }
      return false;
    },
    [forminfo]
  );
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormInfo((prev) => ({ ...prev, [name]: value }));
  }, []);
  const resultBox = useMemo(() => {
    if (saveResult) {
      return saveResult;
    }
    return null;
  }, [saveResult]);
  return (
    <div>
      <div className={styles.wrapper}>
        {navBtns}
        <form>
          {resultBox}
          <div>
            <label htmlFor="Passcode">Passcode</label>
            <input
              type="password"
              name="passcode"
              placeholder="passcode"
              value={forminfo["passcode"]}
              onChange={handleChange}
            />
          </div>

          <button type="submit" onClick={saveToServer}>
            Get token list from server
          </button>
        </form>
      </div>
    </div>
  );
}
export default GetToken;
