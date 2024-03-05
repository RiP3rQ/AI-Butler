import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CodeIcon,
  ImageIcon,
  MusicIcon,
  NotebookIcon,
  PersonStandingIcon,
  StickyNoteIcon,
  TextIcon,
  VideoIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

const CategorySelector = () => {
  const router = useRouter();
  return (
    <Select
      onValueChange={(value) => {
        router.push(`/${value.toLowerCase()}`);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Change category..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Personalities">
          <div className={"flex items-center space-x-4"}>
            <PersonStandingIcon size={20} />
            <div>Personalities</div>
          </div>
        </SelectItem>
        <SelectItem value="Notes">
          <div className={"flex items-center space-x-4"}>
            <StickyNoteIcon size={20} />
            <div>Notes</div>
          </div>
        </SelectItem>
        <SelectItem value="Journal">
          <div className={"flex items-center space-x-4"}>
            <NotebookIcon size={20} />
            <div>Journal</div>
          </div>
        </SelectItem>
        <SelectItem value="PDFs">
          <div className={"flex items-center space-x-4"}>
            <TextIcon size={20} />
            <div>PDFs</div>
          </div>
        </SelectItem>
        <SelectItem value="Audios">
          <div className={"flex items-center space-x-4"}>
            <MusicIcon size={20} />
            <div>Audios</div>
          </div>
        </SelectItem>
        <SelectItem value="Videos">
          <div className={"flex items-center space-x-4"}>
            <VideoIcon size={20} />
            <div>Videos</div>
          </div>
        </SelectItem>
        <SelectItem value="Images">
          <div className={"flex items-center space-x-4"}>
            <ImageIcon size={20} />
            <div>Images</div>
          </div>
        </SelectItem>
        <SelectItem value="Code">
          <div className={"flex items-center space-x-4"}>
            <CodeIcon size={20} />
            <div>Code</div>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
export default CategorySelector;

const CustomSelectItem = ({ value, Icon, children }) => {
  return (
    <SelectItem value={value}>
      <div className={"flex items-center space-x-4"}>
        <Icon size={20} />
        <div>{children}</div>
      </div>
    </SelectItem>
  );
};
