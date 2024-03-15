import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Bot,
  CodeIcon,
  ImageIcon, LucideIcon,
  MusicIcon,
  NotebookIcon,
  PersonStandingIcon,
  StickyNoteIcon,
  TextIcon,
  VideoIcon
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export const AvailableModules = [
  {
    value: "Notes",
    Icon: StickyNoteIcon,
    description: "Create and manage your notes"
  },
  {
    value: "Chatgpt",
    Icon: Bot,
    description: "Chat with AI"
  },
  {
    value: "Personalities",
    Icon: PersonStandingIcon,
    description: "Create and manage your personalities"
  },
  {
    value: "Journal",
    Icon: NotebookIcon,
    description: "Create and manage your journal"
  },
  {
    value: "Pdfs",
    Icon: TextIcon,
    description: "Create and manage your pdfs"
  },
  {
    value: "Audios",
    Icon: MusicIcon,
    description: "Create and manage your audios"
  },
  {
    value: "Images",
    Icon: ImageIcon,
    description: "Create and manage your images"
  }
];

const ModuleSelector = () => {
  const router = useRouter();
  const pathname = usePathname().split("/")[1].charAt(0).toUpperCase() + usePathname().split("/")[1].slice(1);

  return (
    <Select
      value={AvailableModules.find((module) => module.value === pathname)?.value}
      onValueChange={(value) => {
        router.push(`/${value.toLowerCase()}`);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Change module." />
      </SelectTrigger>
      <SelectContent>
        {AvailableModules.map((module, index) => (
          <CustomSelectItem key={index} value={module.value} Icon={module.Icon} />
        ))}
      </SelectContent>
    </Select>
  );
};
export default ModuleSelector;

// set types for custom select item
export const CustomSelectItem = ({ value, Icon }: {
  value: string;
  Icon: LucideIcon;
}) => {
  return (
    <SelectItem value={value}>
      <div className={"flex items-center space-x-4"}>
        <Icon size={20} />
        <div>{value}</div>
      </div>
    </SelectItem>
  );
};
