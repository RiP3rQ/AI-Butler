import { OrganizationList } from "@clerk/nextjs";

export default function CreateOrganizationPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <OrganizationList
        hidePersonal
        afterSelectOrganizationUrl="/notion/organization/:id"
        afterCreateOrganizationUrl="/notion/organization/:id"
        skipInvitationScreen
        appearance={{ variables: { colorPrimary: "#0f172A" } }}
      />
    </div>
  );
}
