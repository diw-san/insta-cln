import React from "react";

export default function Loading() {
  return (
    <div>
      <div className="w-full border h-screen flex items-center justify-center">
        <img
          className="animate-pulse size-28"
          src="https://png.pngtree.com/png-clipart/20180518/ourmid/pngtree-instagram-icon-instagram-logo-png-image_3571406.png"
          alt="Loading..."
        />
      </div>
    </div>
  );
}
