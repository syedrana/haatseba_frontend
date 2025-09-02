"use client";

import clsx from "clsx";
import React, { useState } from "react";

export function Tabs({ defaultValue, children }) {
  const [active, setActive] = useState(defaultValue);
  const triggers = [];
  const contents = [];

  children.forEach((child) => {
    if (child.type.displayName === "TabsList") {
      triggers.push(
        <child.type
          key="tabslist"
          {...child.props}
          active={active}
          setActive={setActive}
        />
      );
    } else if (child.type.displayName === "TabsContent") {
      contents.push(
        <child.type key={child.props.value} {...child.props} active={active} />
      );
    }
  });

  return (
    <div>
      {triggers}
      {contents}
    </div>
  );
}

export function TabsList({ children, active, setActive, className }) {
  return (
    <div className={clsx("flex border-b border-gray-200 gap-2", className)}>
      {children.map((child) =>
        React.cloneElement(child, { active, setActive })
      )}
    </div>
  );
}
TabsList.displayName = "TabsList";

export function TabsTrigger({ value, children, active, setActive, className }) {
  const isActive = active === value;
  return (
    <button
      onClick={() => setActive(value)}
      className={clsx(
        "px-4 py-2 rounded-t-lg font-medium transition-colors",
        isActive
          ? "bg-gray-800 text-white shadow"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200",
        className
      )}
    >
      {children}
    </button>
  );
}
TabsTrigger.displayName = "TabsTrigger";

export function TabsContent({ value, active, children }) {
  if (active !== value) return null;
  return <div className="pt-4">{children}</div>;
}
TabsContent.displayName = "TabsContent";
