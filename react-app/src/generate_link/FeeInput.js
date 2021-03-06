import React from "react";
import NumberInput from "./NumberInput";

const FeeInput = ({ title, fee, setFee, onChange }) => {
  return (
    <div className="swap-field">
      <label className="swap-field__label label">{title}</label>
      <NumberInput
        value={fee}
        onChange={(input) => {
          setFee(input);
          onChange(input);
        }}
      />

      <svg
        className="swap-field__currency-icon"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M2.82183 16L5.13576 11.9929L7.4497 8L9.74952 3.99295L10.1305 3.35802L10.2998 3.99295L11.0052 6.63139L10.2151 8L7.90119 11.9929L5.60137 16H8.3668L10.6807 11.9929L11.88 9.91887L12.4444 11.9929L13.5167 16H16L14.9276 11.9929L13.8553 8L13.5732 6.97002L15.2945 3.99295H12.783L12.6984 3.69665L11.8236 0.42328L11.7107 0H9.29802L9.24158 0.0846561L6.98409 3.99295L4.67015 8L2.37033 11.9929L0.0563965 16H2.82183Z" />
      </svg>
    </div>
  );
};

export default FeeInput;
