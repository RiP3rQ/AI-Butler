import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

type Props = {
  title: string;
  icon: LucideIcon;
  description: string;
  href: string;
};

export default function ModuleCard({ title, icon: Icon, description, href }: Props) {
  return (
    <Link href={href} className={"h-fit my-0"}>
      <Card className={"h-56 flex flex-col items-center justify-center"}>
        <CardHeader>
          <CardTitle className={"flex gap-7 items-center justify-center"}><Icon className="mr-2 mt-1 h-6 w-6" /> {title}
          </CardTitle>
        </CardHeader>
        <CardContent className={"text-center"}>
          <p>{description}</p>
        </CardContent>
        <CardFooter className={"flex items-center justify-center"}>

          <Button
            color="primary"
            variant={"outline"}
          >
            Open {<ArrowRight />}
          </Button>

        </CardFooter>
      </Card>
    </Link>
  );
}