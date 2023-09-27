import Sports from "@/screens/Sports/Sports";

export default function Page({ params }) {
  return <Sports slug={params.slug} />;
}
