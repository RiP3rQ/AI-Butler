import { auth } from "@clerk/nextjs";
import { db } from "@/lib/drizzle";
import { $postsAnalysis } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

const getData = async (userId: string) => {

  console.log(userId);
  const analyses = await db
    .select()
    .from($postsAnalysis)
    .where(eq($postsAnalysis.userId, userId));
  const total = analyses.reduce((acc: any, curr: any) => {
    return acc + curr.sentimentScore;
  }, 0);
  const average = total / analyses.length;
  return { analyses, average };
};

const HistoryPage = async () => {
  const { userId } = auth();
  const { analyses, average } = await getData(userId!);

  console.log(analyses);
  console.log(average);

  return (
    <div className="h-full px-6 py-8">
      <div>
        <h1 className="mb-4 text-2xl">{`Avg. Sentiment: ${average}`}</h1>
      </div>
      <div className="h-full w-full">analiza</div>
    </div>
  );
};

export default HistoryPage;
