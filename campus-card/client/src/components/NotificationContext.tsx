// src/context/NotificationContext.tsx
import React, { createContext, useContext, useState } from "react";

type Notification = {
  id: number;
  label: string;
  fresh: boolean;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (label: string) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, label: "Payment posted for Campus Bookstore", fresh: true },
    { id: 2, label: "You earned 120 campus reward points", fresh: true },
    {
      id: 3,
      label: "Security reminder: update recovery question",
      fresh: false,
    },
  ]);

  const addNotification = (label: string) => {
    setNotifications((prev) => [
      { id: Date.now(), label, fresh: true },
      ...prev,
    ]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  return ctx;
};
