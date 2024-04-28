import React from "react";
import { Button, ButtonProps } from "../ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  loading: boolean;
} & ButtonProps;

const LoadingButton: React.FC<Props> = ({ children, loading, ...props }) => {
  return (
    <Button {...props} disabled={props.disabled || loading}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};

export default LoadingButton;
