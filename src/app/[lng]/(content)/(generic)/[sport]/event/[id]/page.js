import MatchDetails from "@/components/matches/MatchDetails";

export default async function Page({ params }) {
  return <MatchDetails id={params.id} sportSlug={params.sport} />;
}
