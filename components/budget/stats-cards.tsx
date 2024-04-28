"use client";

import { GetBalanceStatsResponseType } from "@/app/api/budget/stats/balance/route";
import SkeletonWrapper from "@/components/budget/skeleton-wrapper";
import { Card } from "@/components/ui/card";
import {
  DateToUTCDate,
  GetFormatterForCurrency,
} from "@/lib/helper/dateHelper";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import React, { ReactNode, useCallback, useMemo } from "react";
import CountUp from "react-countup";

interface Props {
  from: Date;
  to: Date;
}

function StatsCards({ from, to }: Props) {
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/budget/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`,
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency("PLN"); // todo: currency global provider
  }, []); // todo: currency global provider

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;

  const balance = income - expense;

  // todo: balance when + make green, when - make red + add signs to income and expense

  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={income}
          title="Income"
          icon={
            <TrendingUp className="h-12 w-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={expense}
          title="Expense"
          icon={
            <TrendingDown className="h-12 w-12 items-center rounded-lg bg-red-400/10 p-2 text-red-500" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={balance}
          title="Balance"
          icon={
            <Wallet className="h-12 w-12 items-center rounded-lg bg-violet-400/10 p-2 text-violet-500" />
          }
        />
      </SkeletonWrapper>
    </div>
  );
}

export default StatsCards;

function StatCard({
  formatter,
  value,
  title,
  icon,
}: {
  formatter: Intl.NumberFormat;
  icon: ReactNode;
  title: String;
  value: number;
}) {
  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter],
  );

  return (
    <Card className="flex h-24 w-full items-center gap-2 p-4">
      {icon}
      <div className="flex flex-col items-start gap-0">
        <p className="text-muted-foreground">{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={formatFn}
          className="text-2xl"
        />
      </div>
    </Card>
  );
}
