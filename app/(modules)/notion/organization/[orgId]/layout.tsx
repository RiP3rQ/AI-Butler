// export async function generateMetadata() {
//   const { orgSlug } = auth();
//
//   return {
//     title: startCase(orgSlug || "organization"),
//   };
// } TODO: Metadata

// todo: update clerk + refactor files

import { OrgControl } from "@/app/(modules)/notion/organization/[orgId]/_components/OrgControl";

const OrganizationIdLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <OrgControl />
      {children}
    </>
  );
};

export default OrganizationIdLayout;
