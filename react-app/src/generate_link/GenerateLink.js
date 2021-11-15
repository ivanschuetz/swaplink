import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import {
  init,
  generateSwapTxs,
  updateFeeTotal,
  updateTokenWithUserSelectedUnit,
} from "./controller";
import AssetInputRow from "./AssetInputRow";
import FeeInput from "./FeeInput";
import SwapLinkView from "./SwapLinkView";
import SelectUnit from "./select_unit/SelectUnit";
import { emptyAlgo } from "./TokenFunctions";

export const GenerateLink = (props) => {
  const [peerAddress, setPeerAddress] = useState("");

  const [sendToken, setSendToken] = useState(emptyAlgo());
  const [receiveToken, setReceiveToken] = useState(null);

  const [myFee, setMyFee] = useState("");
  const [peerFee, setPeerFee] = useState("");
  const [feeTotal, setFeeTotal] = useState("");
  const [hideFeeTotal, setHideFeeTotal] = useState(false);

  const [swapLink, setSwapLink] = useState("");
  const [swapLinkTruncated, setSwapLinkTruncated] = useState("");

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showFeesModal, setShowFeesModal] = useState(false);
  const [showSendUnitModal, setShowSendUnitModal] = useState(false);
  const [showReceiveUnitModal, setShowReceiveUnitModal] = useState(false);

  useEffect(() => {
    init(props.statusMsg, setMyFee, setPeerFee, setFeeTotal);
  }, []);

  const updateTokenWithSelectedUnit = async (setToken, unit) => {
    updateTokenWithUserSelectedUnit(
      props.statusMsg,
      props.showProgress,
      props.myAddress,
      props.myBalance,
      setToken,
      unit
    );
  };

  return (
    <div>
      <div className="container">
        <div style={{ marginTop: 20, marginBottom: 40 }}>
          {"Generate a link to swap Algos, ASAs or NFTs with a peer"}
        </div>
        <div>
          <div>{"Peer"}</div>
          <input
            placeholder="Peer address"
            className="address-input"
            size="64"
            value={peerAddress}
            onChange={(event) => {
              setPeerAddress(event.target.value);
            }}
          />

          <div id="swap-container">
            <div>{"You send"}</div>
            <AssetInputRow
              token={sendToken}
              setToken={setSendToken}
              onUnitClick={() => setShowSendUnitModal(true)}
            />

            <button
              onClick={() => {
                setSendToken(receiveToken);
                setReceiveToken(sendToken);
              }}
            >
              {"Invert"}
            </button>

            <div>{"You receive"}</div>
            <AssetInputRow
              token={receiveToken}
              setToken={setReceiveToken}
              onUnitClick={() => {
                setShowReceiveUnitModal(true);
              }}
            />
          </div>

          <div id="fee-container">
            <span style={{ marginRight: 5 }}>{"Fee:"}</span>
            <span>
              <button
                onClick={async () => {
                  setShowFeesModal(true);
                }}
              >
                {feeTotal}
              </button>
            </span>
          </div>

          <button
            className="submit-button"
            disabled={
              props.myAddress === "" ||
              peerAddress === "" ||
              !sendToken ||
              !receiveToken
                ? true
                : false
            }
            onClick={async () => {
              await generateSwapTxs(
                sendToken,
                receiveToken,
                props.myAddress,
                peerAddress,
                myFee,
                peerFee,
                props.statusMsg,
                props.showProgress,
                setSwapLink,
                setSwapLinkTruncated,
                setShowLinkModal
              );
            }}
          >
            {"Generate link"}
          </button>

          {showLinkModal && (
            <Modal title={"Done!"} onCloseClick={() => setShowLinkModal(false)}>
              <SwapLinkView
                swapLinkTruncated={swapLinkTruncated}
                swapLink={swapLink}
              />
            </Modal>
          )}
          {showFeesModal && (
            <Modal title={"Fees"} onCloseClick={() => setShowFeesModal(false)}>
              <FeeInput
                title={"Your fee"}
                fee={myFee}
                setFee={setMyFee}
                onChange={(input) => {
                  updateFeeTotal(
                    props.statusMsg,
                    input,
                    peerFee,
                    setFeeTotal,
                    setHideFeeTotal
                  );
                }}
              />
              <FeeInput
                title={"Peer's fee"}
                fee={peerFee}
                setFee={setPeerFee}
                onChange={(input) =>
                  updateFeeTotal(
                    props.statusMsg,
                    myFee,
                    input,
                    setFeeTotal,
                    setHideFeeTotal
                  )
                }
              />
              {!hideFeeTotal && (
                <div>
                  <span style={{ marginRight: 5 }}>{"Total:"}</span>
                  <span>{feeTotal}</span>
                  <span>{" Algo"}</span>
                </div>
              )}
            </Modal>
          )}
          {showSendUnitModal &&
            createSelectUnitModal(
              props.statusMsg,
              props.showProgress,
              sendToken?.assetId,
              setSendToken,
              updateTokenWithSelectedUnit,
              setShowSendUnitModal
            )}
          {showReceiveUnitModal &&
            createSelectUnitModal(
              props.statusMsg,
              props.showProgress,
              receiveToken?.assetId,
              setReceiveToken,
              updateTokenWithSelectedUnit,
              setShowReceiveUnitModal
            )}
        </div>
      </div>
    </div>
  );
};

const createSelectUnitModal = (
  statusMsg,
  showProgress,
  assetId,
  setToken,
  updateTokenWithSelectedUnit,
  setShowUnitModal
) => {
  return (
    <Modal title={"Unit"} onCloseClick={() => setShowUnitModal(false)}>
      <SelectUnit
        statusMsg={statusMsg}
        initialAssetId={assetId}
        showProgress={showProgress}
        onSelectUnit={async (unit) => {
          setShowUnitModal(false);
          await updateTokenWithSelectedUnit(setToken, unit);
        }}
      />
    </Modal>
  );
};
