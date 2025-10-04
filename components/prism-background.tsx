"use client";

import React from "react";
import Threads from "./Threads";

export default function PrismBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <Threads amplitude={1} distance={0} enableMouseInteraction={true} />
    </div>
  );
}
