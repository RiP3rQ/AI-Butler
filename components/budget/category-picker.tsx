"use client";

import CreateCategoryDialog from "@/components/budget/category-create-dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useCallback, useEffect } from "react";
import { BudgetCategoryType } from "@/lib/drizzle/schema";

interface Props {
  type: TransactionType;
  onChange: (value: string) => void;
}

function CategoryPicker({ type, onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  useEffect(() => {
    if (!value) return;
    // when the value changes, call onChange callback
    onChange(value);
  }, [onChange, value]);

  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/budget/categories?type=${type}`).then((res) => res.json()),
  });

  //todo: wywalić useQuery i dodać swr i revalidate
  // todo: loading state wraz z useSWR

  console.log(categoriesQuery.data);

  const selectedCategory = categoriesQuery.data?.find(
    (category: BudgetCategoryType) => category.name === value,
  );

  const successCallback = useCallback(
    (category: BudgetCategoryType) => {
      setValue(category.name);
      setOpen((prev) => !prev);
    },
    [setValue, setOpen],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            "Select category"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CommandInput placeholder="Search category..." />
          <CreateCategoryDialog type={type} successCallback={successCallback} />
          <CommandEmpty>
            <p>Category not found</p>
            <p className="text-xs text-muted-foreground">
              Tip: Create a new category
            </p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {categoriesQuery.data &&
                categoriesQuery.data.map((category: BudgetCategoryType) => (
                  <CommandItem
                    key={category.name}
                    onSelect={() => {
                      setValue(category.name);
                      setOpen((prev) => !prev);
                    }}
                  >
                    <CategoryRow category={category} />
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 opacity-0",
                        value === category.name && "opacity-100",
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default CategoryPicker;

function CategoryRow({ category }: { category: BudgetCategoryType }) {
  return (
    <div className="flex items-center gap-2">
      <span role="img">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
}
