import React from "react";

import "./loading-spinner.styles.css";

const LoadingSpinner = () => {
  return (
    <div
      style={{
        height: "100px",
        width: "100px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h5 className="text-center">Loading....</h5>
      {/* <span>Loading....</span> */}
      <div
        className='loading-spinner'
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          border: "3px solid rgb(190, 190, 190, 0.8)",
          borderTop: "4px solid #fff",
          borderRadius: "50%",
        }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
