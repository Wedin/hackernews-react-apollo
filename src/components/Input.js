import React from "react";

export default ({ label, onChange, value, id, placeholder, type }) => {
  return (
    <>
      <label htmlFor={id} className="f6 b db mb2">
        {label}
      </label>

      <input
        id={id}
        className="input-reset ba b--black-20 pa2 mb2 db w-100"
        value={value}
        onChange={onChange}
        type={type || "text"}
        placeholder={placeholder}
      />
    </>
  );
};
