const AssetInputRow = ({ token, setToken, onUnitClick }) => {
  return (
    <div className="input-row">
      {assetAmountView(token, setToken)}
      <button onClick={() => onUnitClick()}>
        {<div>{token?.unit?.label ?? "Select asset"}</div>}
      </button>
      {token && (
        <div>
          <span>{"Balance: " + token.balance}</span>
          {generateMaxView(token, () => {
            setToken((t) => {
              return {
                ...t,
                amount: t.balance,
              };
            });
          })}
        </div>
      )}
    </div>
  );
};

const generateMaxView = (token, onClick) => {
  return (
    token.balance !== "" &&
    token.balance !== "0" && <button onClick={onClick}>{"max"}</button>
  );
};

const assetAmountView = (token, setToken) => {
  return (
    <input
      placeholder={"Amount"}
      className="inline"
      size="16"
      value={token?.amount}
      onChange={(event) => {
        setToken({
          ...token,
          amount: event.target.value,
        });
      }}
    />
  );
};

export default AssetInputRow;
