import Link from "next/link";
import { useParams } from "next/navigation";

export const CustomLink = (props) => {
  const params = useParams();

  return <Link {...props} href={`/${params.lng}${props.href}`} />;
};
