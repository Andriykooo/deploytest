import Sports from "@/screens/Sports/Sports";

export const dynamic = "force-static";

export default function Page({ params }) {
  return <Sports slug={params.slug} />;
}
