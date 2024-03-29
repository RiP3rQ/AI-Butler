import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bot,
  LucideIcon,
  NotebookIcon,
  StickyNoteIcon,
  TextIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export const AvailableModules = [
  {
    value: "Notes",
    Icon: StickyNoteIcon,
    description:
      "Create and manage your smart notes, that can be processed by AI for better understanding and powerfull insights.",
  },
  {
    value: "Chatgpt",
    Icon: Bot,
    description:
      "Chat with newest OpenAI's model and get answers to your questions blazing fast.",
  },
  {
    value: "Journal",
    Icon: NotebookIcon,
    description:
      "Create journal posts that can be processed by AI for analysis and insights about things like your mood, sentiment and more.",
  },
  {
    value: "Pdfs",
    Icon: TextIcon,
    description:
      "Upload PDFs that can be processed by AI for better understanding and insights.",
  },
];

const ModuleSelector = () => {
  const router = useRouter();
  const pathname =
    usePathname().split("/")[1].charAt(0).toUpperCase() +
    usePathname().split("/")[1].slice(1);

  return (
    <Select
      value={
        AvailableModules.find((module) => module.value === pathname)?.value
      }
      onValueChange={(value) => {
        router.push(`/${value.toLowerCase()}`);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Change module..." />
      </SelectTrigger>
      <SelectContent>
        {AvailableModules.map((module, index) => (
          <CustomSelectItem
            key={index}
            value={module.value}
            Icon={module.Icon}
          />
        ))}
      </SelectContent>
    </Select>
  );
};
export default ModuleSelector;

// set types for custom select item
export const CustomSelectItem = ({
  value,
  Icon,
}: {
  value: string;
  Icon: LucideIcon;
}) => {
  return (
    <SelectItem value={value} className={"cursor-pointer"}>
      <div className={"flex  items-center  space-x-4"}>
        <Icon size={20} />
        <div>{value}</div>
      </div>
    </SelectItem>
  );
};
