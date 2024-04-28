import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { History } from "lucide-react";

const AuditHistoryButton = () => {
  const router = useRouter();
  return (
    <Button
      variant={"outline"}
      size={"icon"}
      className="rounded-full"
      onClick={() => {
        router.push("/history");
      }}
    >
      <History className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Audit History</span>
    </Button>
  );
};
export default AuditHistoryButton;