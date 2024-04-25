import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AddCreditsButton = () => {
  return (
    <Button className="flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 px-2 py-1 text-white transition hover:from-blue-500 hover:to-purple-600">
      <Plus className="h-6 w-6" strokeWidth={3} />
      Add Credits
    </Button>
  );
};

export default AddCreditsButton;
