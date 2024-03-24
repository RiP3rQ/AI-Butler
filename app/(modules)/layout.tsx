import Navbar from "@/components/Navbar";

export default function ModulesLayout({
                                        children
                                      }: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="m-auto px-4">{children}</main>
    </>
  );
}
