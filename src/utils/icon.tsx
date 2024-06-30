import React from "react";
import { LuArrowUpRight, LuArrowDownRight } from "react-icons/lu";

export const renderChangeIcon = (change: number) => {
    if (change > 0) {
      return <LuArrowUpRight className="text-green-500" />;
    } else if (change < 0) {
      return <LuArrowDownRight className="text-red-500" />;
    } else {
      return null;
    }
  };