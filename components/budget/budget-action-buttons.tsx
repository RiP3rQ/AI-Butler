import CreateTransactionDialog from "@/components/budget/create-transation-dialog";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export const BudgetActionButtons = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="border-b bg-card">
      <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
        <p className="text-3xl font-bold">Hello, {user.firstName}! 👋</p>

        <div className="flex items-center gap-3">
          <CreateTransactionDialog
            trigger={
              <Button
                variant={"outline"}
                className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
              >
                New income 🤑
              </Button>
            }
            type="income"
          />

          <CreateTransactionDialog
            trigger={
              <Button
                variant={"outline"}
                className="border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white"
              >
                New expense 😤
              </Button>
            }
            type="expense"
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetActionButtons;
