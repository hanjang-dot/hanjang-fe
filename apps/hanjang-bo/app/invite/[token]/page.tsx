import InviteAcceptPage from "@/pages/invite-accept";

const Page = async ({ params }: { params: Promise<{ token: string }> }) => {
  const { token } = await params;
  return <InviteAcceptPage token={token} />;
};

export default Page;
