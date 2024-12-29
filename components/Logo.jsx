import Link from "next/link";

const Logo = ({light = false}) => {
  // determine the text clolr based on the light group
  const colorClass = light ? "text-white" : "text-primary"; // default to black
  return (
    <Link href="/" className="font-primary text-2xl tracking-[4px]">
      <span className={colorClass}> Junho Bae </span>
    </Link>
  );
};

export default Logo;
