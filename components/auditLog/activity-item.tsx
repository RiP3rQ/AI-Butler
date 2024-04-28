import { AuditLogType } from "@/drizzle/schema";

import { generateLogMessage } from "@/lib/auditLog/generateAuditLogMessage";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";

interface ActivityItemProps {
  data: AuditLogType;
}

export const ActivityItem = ({ data }: ActivityItemProps) => {
  return (
    <li className="flex items-center gap-x-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={data.userImage!} />
      </Avatar>
      <div className="flex flex-col space-y-0.5">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-neutral-700">
            {data.userName}
          </span>{" "}
          {generateLogMessage(data)}
        </p>
        <p className="text-xs text-muted-foreground">
          {moment(new Date(data.createdAt!)).format("MMM DD, YYYY h:mm A")}
        </p>
      </div>
    </li>
  );
};
