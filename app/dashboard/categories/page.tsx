import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CreateCategoryDialog } from "@/components/categories/create-category-dialog";
import { CategoryCard } from "@/components/categories/category-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const incomeCategories = categories?.filter((c) => c.type === "income") || [];
  const expenseCategories =
    categories?.filter((c) => c.type === "expense") || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Categories</h1>
          <p className="text-text-secondary">
            Manage your income and expense categories.
          </p>
        </div>
        <CreateCategoryDialog />
      </div>

      {/* Content */}
      <Tabs defaultValue="expense" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/5 p-1 rounded-xl mb-6">
          <TabsTrigger
            value="income"
            className="data-[state=active]:bg-brand-primary data-[state=active]:text-white text-text-muted rounded-lg py-2.5 transition-all text-sm font-medium flex items-center gap-2 justify-center"
          >
            <ArrowUpCircle className="w-4 h-4" />
            Income
          </TabsTrigger>
          <TabsTrigger
            value="expense"
            className="data-[state=active]:bg-accent-danger data-[state=active]:text-white text-text-muted rounded-lg py-2.5 transition-all text-sm font-medium flex items-center gap-2 justify-center"
          >
            <ArrowDownCircle className="w-4 h-4" />
            Expense
          </TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {incomeCategories.length > 0 ? (
              incomeCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-text-muted bg-white/5 rounded-2xl border border-white/5 border-dashed">
                <p>No income categories yet.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="expense" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expenseCategories.length > 0 ? (
              expenseCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-text-muted bg-white/5 rounded-2xl border border-white/5 border-dashed">
                <p>No expense categories yet.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
