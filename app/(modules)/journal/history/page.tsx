import { auth } from "@clerk/nextjs";
import { db } from "@/lib/drizzle";
import { $postsAnalysis } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import LineHistoryChart from "@/components/charts/LineChart";

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

  return (
    <div className="h-[calc(100vh-8rem)] px-6 pt-8">
      <div>
        <h1 className="mb-4 text-2xl">{`Avg. Sentiment: ${average}`}</h1>
      </div>
      <div className="h-full w-full">
        <LineHistoryChart data={analyses} />
      </div>
    </div>
  );
};

export default HistoryPage;
