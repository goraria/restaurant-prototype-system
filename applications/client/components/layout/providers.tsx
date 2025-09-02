"use client";

import React, { ReactNode } from "react";
import StoreProvider from "@/state/redux";

const Providers = ({
  children
}: {
  children: ReactNode
}) => {
  return <StoreProvider>{children}</StoreProvider>;
};

export default Providers;