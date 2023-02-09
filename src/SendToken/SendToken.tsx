import React, { ReactElement, useCallback, useMemo, useState } from "react";
import styles from "./SendToken.module.scss";
// import { useMutation } from "react-query";

function SendToken() {
  let [forminfo, setFormInfo] = useState({
    username: "",
    token: "",
    owner: "",
  });
  const [saveResult, setSaveResult] = useState<ReactElement | null>(null);
  // use react query to send post request to server
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
        "https://eakxumvlet77rtusg5b7ji5wvi0ufhtd.lambda-url.us-east-2.on.aws/",
        {
          method: "POST",
          body: JSON.stringify(forminfo),
        }
      );
      if (response.ok) {
        setSaveResult(
          <div className={styles.success}>
            <p>Thanks for your Contribution!</p>
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
        <form>
          {resultBox}
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              placeholder="username"
              value={forminfo["username"]}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="token">Token</label>
            <input
              type="text"
              name="token"
              placeholder="token"
              value={forminfo["token"]}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="owner">Owner</label>
            <input
              type="text"
              name="owner"
              placeholder="owner"
              value={forminfo["owner"]}
              onChange={handleChange}
            />
          </div>
          <button type="submit" onClick={saveToServer}>
            Save to Server
          </button>
        </form>
      </div>
    </div>
  );
}
export default SendToken;
