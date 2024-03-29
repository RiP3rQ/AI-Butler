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

export default function ModuleCard({
                                     title,
                                     icon: Icon,
                                     description,
                                     href
                                   }: Props) {
  return (
    <Link href={href} className={"my-0 h-fit"}>
      <Card className={"flex h-56 flex-col items-center justify-center"}>
        <CardHeader>
          <CardTitle
            className={"flex items-center justify-center gap-7 text-2xl"}
          >
            <Icon />
            <span className={"pt-1"}>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className={"text-center"}>
          <p>{description}</p>
        </CardContent>
        <CardFooter className={"flex items-center justify-center"}>
          <Button color="primary" variant={"outline"}>
            Open {<ArrowRight />}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
