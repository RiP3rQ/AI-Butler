import { auth } from "@clerk/nextjs";
import { db } from "@/lib/drizzle";
import { $postsAnalysis } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import LineHistoryChart from "@/components/charts/LineChart";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DonutHistoryChart from "@/components/charts/DonutChart";
import BarHistoryChart from "@/components/charts/BarChart";

const getData = async (userId: string) => {
  const analyses = await db
    .select()
    .from($postsAnalysis)
    .where(eq($postsAnalysis.userId, userId));
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

  // TODO: (Later) Full page charts on click

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
      <div className={"space-y-2"}>
        <Card>
          <div
            className={
              "w-full text-center font-bold text-black dark:text-muted-foreground"
            }
          >
            Sentiment Analysis History
          </div>
          <Separator className={"my-1"} />
          <div className={"h-96 w-full"}>
            <LineHistoryChart data={analyses} />
          </div>
        </Card>
        <div className={"grid grid-cols-2 gap-2"}>
          <Card>
            <div
              className={
                "w-full text-center font-bold text-black dark:text-muted-foreground"
              }
            >
              Positive vs Negative Sentiment
            </div>
            <Separator className={"my-1"} />
            <div className={"h-56 w-full"}>
              <DonutHistoryChart data={analyses} />
            </div>
          </Card>
          <Card>
            <div
              className={
                "w-full text-center font-bold text-black dark:text-muted-foreground"
              }
            >
              Sentiment Distribution
            </div>
            <Separator className={"my-1"} />
            <div className={"h-56 w-full"}>
              <BarHistoryChart data={analyses} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
