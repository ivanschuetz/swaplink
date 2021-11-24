const wasmPromise = import("wasm");

export const init = async (statusMsg, setMyFee, setPeerFee, setFeeTotal) => {
  try {
    const { init_log, bridge_suggested_fees } = await wasmPromise;
    await init_log();

    const suggestedFees = await bridge_suggested_fees();
    setMyFee(suggestedFees.mine);
    setPeerFee(suggestedFees.peer);
    setFeeTotal(suggestedFees.total);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const initDefaultToken = async (statusMsg, setToken, myBalance) => {
  try {
    const { bridge_algo_token } = await wasmPromise;

    let token = await bridge_algo_token({ balance: myBalance });
    setToken(token);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const generateSwapTxs = async (
  sendToken,
  receiveToken,
  myAddress,
  peerAddress,
  myFee,
  peerFee,
  statusMsg,
  showProgress,
  setSwapLink,
  setSwapLinkTruncated,
  setShowLinkModal,
  wallet
) => {
  try {
    const { bridge_generate_swap_txs, bridge_generate_link } =
      await wasmPromise;
    statusMsg.clear();
    showProgress(true);

    let swapPars = {
      my_address: myAddress,
      peer_address: peerAddress,

      send_amount: sendToken.amount,
      send_asset_id: sendToken.id,
      send_unit: sendToken.asset_type,

      receive_amount: receiveToken.amount,
      receive_asset_id: receiveToken.id,
      receive_unit: receiveToken.asset_type,

      my_fee: myFee,
      peer_fee: peerFee,
    };

    let swapTxs = await bridge_generate_swap_txs(swapPars);
    showProgress(false);

    const signedTx = await wallet.sign(swapTxs.to_sign_wc);

    let link = await bridge_generate_link({
      signed_my_tx_msg_pack: signedTx,
      pt: swapTxs.pt, // passthrough
    });

    setSwapLink(link);
    setSwapLinkTruncated(link.replace(/(.*)\/(.*).(?=....)/, "$1/..."));
    setShowLinkModal(true);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};

export const updateFeeTotal = async (
  statusMsg,
  myFee,
  peerFee,
  setTotalFee,
  setHideFeeTotal
) => {
  try {
    const { bridge_add_fees } = await wasmPromise;
    statusMsg.clear();

    let res = await bridge_add_fees({
      my_fee: myFee,
      peer_fee: peerFee,
    });
    setTotalFee(res.total);
    setHideFeeTotal(false);
  } catch (e) {
    statusMsg.error(e);
    // couldn't calculate total: clear the outdated total (just for correctness) and hide the view
    setTotalFee("");
    setHideFeeTotal(true);
  }
};

export const fetchAssetHoldings = async (
  statusMsg,
  showProgress,
  address,
  assetId,
  ptForBridgeAssetHoldings
) => {
  try {
    const { bridge_asset_holdings } = await wasmPromise;
    statusMsg.clear();
    showProgress(true);

    let res = await bridge_asset_holdings({
      address: address,
      asset_id: assetId,
      pt: ptForBridgeAssetHoldings,
    });

    showProgress(false);

    return res.holdings;
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};
