import { auth } from "@clerk/nextjs";
import { db } from "../../../../drizzle";
import { postsAnalysis } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { Separator } from "@/components/ui/separator";
import ChartsProvider from "@/components/providers/charts-provider";

const getData = async (userId: string) => {
  const analyses = await db
    .select()
    .from(postsAnalysis)
    .where(eq(postsAnalysis.userId, userId));
  const total = analyses.reduce((acc: any, curr: any) => {
    return acc + parseInt(curr.sentimentScore);
  }, 0);
  console.log("total", total);
  const average = total / analyses.length;
  console.log("average", average);
  return { analyses, average };
};

const HistoryPage = async () => {
  const { userId } = auth();
  const { analyses, average } = await getData(userId!);

  const roundedAverage = Math.round(average * 100) / 100;

  return (
    <div className="h-[calc(100vh-8rem)] px-6">
      <Breadcrumb className={"w-full pt-4 text-xl font-bold"}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/journal">Journal</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Analysis History</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Separator className={"mb-3 mt-1"} />
      <div>
        <h1 className="mb-4 text-2xl">{`Avg. Sentiment: ${roundedAverage}`}</h1>
      </div>
      <ChartsProvider analyses={analyses} />
    </div>
  );
};

export default HistoryPage;
