"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

import SubscriptionModal from "@/components/global/subscription-modal";
import { ProductWirhPrice } from "@/databases/drizzle/supabase.types";

type SubscriptionModalContextType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const SubscriptionModalContext = createContext<SubscriptionModalContextType>({
  open: false,
  setOpen: () => {},
});

export const useSubscriptionModal = () => {
  return useContext(SubscriptionModalContext);
};

export const SubscriptionModalProvider = ({
  children,
  products,
}: {
  children: React.ReactNode;
  products: ProductWirhPrice[];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <SubscriptionModalContext.Provider value={{ open, setOpen }}>
      {children}
      <SubscriptionModal products={products} />
    </SubscriptionModalContext.Provider>
  );
};
