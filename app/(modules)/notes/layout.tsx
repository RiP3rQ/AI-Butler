import NavbarNotes from "../../../components/notes/NavbarNotes";

export default function NotesLayout({
                                      children
                                    }: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarNotes />
      <main className="m-auto max-w-7xl p-4">{children}</main>
    </>
  );
}
