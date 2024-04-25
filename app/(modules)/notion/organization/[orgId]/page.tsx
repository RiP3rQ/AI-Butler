import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

export default async function NotionPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div>
        <Breadcrumb className={"w-full pt-4 text-xl font-bold"}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Notion</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Separator className={"mb-1 mt-1 w-full"} />

        <NotionCreateWorkspace />
      </div>
    </div>
  );
}
