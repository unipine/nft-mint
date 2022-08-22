import { useCallback, useEffect, useState } from "react";

import { generateWallet, getWallet } from "../services/wallet.service";
import { WalletType } from "../types/wallet";

const Wallet = () => {
  const [wallet, setWallet] = useState<WalletType>();
  const [message, setMessage] = useState<string>();
  const [show, setShow] = useState<boolean>(false);

  const init = useCallback(() => {
    getWallet()
      .then((response) => {
        setWallet(response.data);
        console.log(response.data);
      })
      .catch((error) =>
        console.warn(error.response.data.message || error.message)
      );
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const handleClick = async () => {
    generateWallet()
      .then((response) => {
        setWallet(response);
      })
      .catch((error) => {
        setMessage(error.response.data.message || error.message);
      });
  };

  const handleShowToggle = () => {
    setShow((prev) => !prev);
  };

  return (
    <div className="card w-50">
      {message && (
        <div className="form-group">
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        </div>
      )}

      {wallet ? (
        <>
          <div className="form-group">
            <label>Public Key</label>
            <input className="form-control" defaultValue={wallet.publicKey} />
          </div>
          <div className="form-group">
            <label>Private Key</label>
            <input
              type={show ? "text" : "password"}
              className="form-control"
              defaultValue={wallet.privateKey}
            />
          </div>
          <button className="btn btn-info" onClick={handleShowToggle}>
            {show ? "Hide Private Key" : "Show Private Key"}
          </button>
        </>
      ) : (
        <>
          <p>Click the button below to create your own wallet!</p>
          <button className="btn btn-success" onClick={handleClick}>
            Generate Wallet
          </button>
        </>
      )}
    </div>
  );
};

export default Wallet;
