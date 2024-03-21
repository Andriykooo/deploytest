import Link from "next/link";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";

export const CustomLink = (props) => {
  const headerData = useSelector((state) => state.headerData);
  const params = useParams();

  let href = props.href;

  if (props.href === "/") {
    const homePage = headerData?.find((page) => page.slug === "index");
    href = homePage?.path || "/";
  }

  return <Link {...props} href={`/${params.lng}${href}`} />;
};
