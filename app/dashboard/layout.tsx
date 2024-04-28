import Navbar from "@/components/global/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="m-auto max-w-7xl pt-4">{children}</main>
    </>
  );
}
