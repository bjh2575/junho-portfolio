import Link from "next/link";
import {FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiTistory } from "react-icons/si";


const socials = [
  {
    icon: <SiTistory />,
    path: "https://bavid98.tistory.com/"
  },
  {
    icon: <FaGithub />,
    path: "https://github.com/bjh2575"
  },
  {
    icon: <FaLinkedin />,
    path: "https://kr.linkedin.com/"
  },
];

const Socials = ({containerStyles, iconStyles}) => {
  return <div className={containerStyles}>
    {socials.map((item, index)=>{
      return (
        <Link href={item.path} key={index} className={iconStyles}>
          <span>{item.icon}</span>
        </Link>
      );
    })}
  </div>;
};

export default Socials;
