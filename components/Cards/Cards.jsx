"use client";
import Card from "./Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { motion , AnimatePresence } from  "framer-motion";
import { DessertIcon } from "lucide-react";

import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaWordpress,
  FaFigma,
} from "react-icons/fa";

const journey = [
  // experience
  {
    type: "experience",
    company: "SK쉴더스",
    logoUrl: "/assets/journey/experience/logo-1.svg",
    position: "정보보안관제",
    duration: "Sep 2023 - Present",
    description: "2023년 9월 입사 후 보안관제 직무를 수행하며 금융권 프로젝트에 파견되어 근무 중입니다. 주요 업무로는 정보 보안 이벤트 모니터링 및 분석, 보안 사고 대응, 그리고 금융권 네트워크 및 시스템의 보안 정책 준수를 지원하고 있습니다.",
  },  
  // education
  {
    type: "education",
    institution: "네트워크관리사 2급",
    logoUrl: "/assets/journey/education/certification.svg",
    qualification: "한국정보통신자격협회",
    duration: "Nov 2021",
    description: "네트워크 구성 및 관리에 필요한 기본 기술과 지식을 검증하는 자격증으로, 네트워크 유지보수와 트러블슈팅 역량을 갖췄음을 증명합니다.",
  },
  {
    type: "education",
    institution: "정보처리기사",
    logoUrl: "/assets/journey/education/certification.svg",
    qualification: "과학기술정보통신부",
    duration: "Jun 2023",
    description: "소프트웨어 설계, 구현, 유지보수 등 IT 전반의 지식을 기반으로 시스템 개발 및 관리 능력을 입증하는 국가기술자격증입니다.",
  },
  {
    type: "education", 
    institution: "AWS Certified Solutions Architect – Associate (SAA-C03)",
    logoUrl: "/assets/journey/education/certification.svg", 
    qualification: "aws certified", 
    duration: "Jul 2023 - Jul 2026 " , 
    description: "AWS 클라우드 아키텍처 설계 및 구현 능력을 검증하는 자격증으로, 효율적이고 안전한 클라우드 솔루션 설계 역량을 보유하고 있음을 증명합니다.",
  },
  {
    type: "education", 
    institution: "CISA (Certified Information Systems Auditor)",
    logoUrl: "/assets/journey/education/certification.svg", 
    qualification: "ISACA (Information Systems Audit and Control Association)", 
    duration: "Nov 2024" , 
    description: "IT 감사, 정보보안 및 통제, 시스템 거버넌스 분야에서의 전문성을 검증하는 국제적으로 공인된 자격증입니다.",
  },
  // skills
  {
    type: "skill",
    name: "HTML",
    icon: <FaHtml5 />,
    duration: "Learned in 2024", 
    description: "Crafted structured web content using HTML effectively for modern websites, ensuring semanting marckup and accessibility.",
  },
  {
    type: "skill",
    name: "CSS",
    icon: <FaCss3Alt />,
    duration: "Learned in 2024", 
    description: "Styled responsive web pages using CSS, ensuring an appealing user experience with modern design principles and layouts.",
  },
  {
    type: "skill",
    name: "Javascript", 
    icon: <FaJs />,
    duration: "Learned in 2024", 
    description: "Implemented Javascript for interactivity, enhancing user engagement on websites through dynamic content and features.",
  },
  {
    type: "skill",
    name: "React.js",
    icon: <FaReact />,
    duration: "Learned in 2024", 
    description:"컴포넌트 기반의 프론트엔드 라이브러리로, 유지보수성과 확장성을 고려한 효율적인 UI 개발 경험을 보유하고 있습니다.",
  },
  {
    type: "skill",
    name: "Splunk", 
    icon: <FaWordpress/>,
    duration: "Learned in 2023", 
    description: "데이터 분석 및 모니터링 도구로, 로그 및 트래픽 데이터를 실시간으로 시각화하고 분석하여 인사이트를 도출하는 데 능숙합니다.",
  },
  {
    type: "skill",
    name: "HTML",
    icon: <FaFigma />,
    duration: "Learned in 2018", 
    description:"Designed user interfaces in Figma, facilitating collaboration and rapid prototyping to meet user needs and project goals.",
  },
];

const Cards = () => {
  return (
    <>
      <Tabs 
        defaultValue="experience" 
        className="w-full flex flex-col items-center"
      >
        <TabsList className="max-w-max mb-[30px]">
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">My Skills</TabsTrigger>
        </TabsList>
        <TabsContent value="experience" className="w-full">
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y:20 }}
              animate={{ opacity: 1, y:0 }}
              exit={{ opacity: 0, y:20 }}
              transition={{ duration: 0.3 }}
            >
             {journey
               .filter((item) => item.type === "experience")
                .map((card, index) => {
                 return <Card key={index} {...card} />;
               })}
            </motion.div>
          </AnimatePresence>         
        </TabsContent>
        <TabsContent value="education" className="w-full">
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y:20 }}
              animate={{ opacity: 1, y:0 }}
              exit={{ opacity: 0, y:20 }}
              transition={{ duration: 0.3 }}
          >
              {journey
                .filter((item) => item.type === "education")
                .map((card, index) => {
                 return <Card key={index} {...card} />;
                })}
            </motion.div> 
          </AnimatePresence>
          
        </TabsContent>
        <TabsContent value="skills" className="w-full">
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y:20 }}
              animate={{ opacity: 1, y:0 }}
              exit={{ opacity: 0, y:20 }}
              transition={{ duration: 0.3 }}
            >
             {journey
               .filter((item) => item.type === "skill")
               .map((card, index) => {
                 return <Card key={index} {...card} />;
                })}
            </motion.div>
          </AnimatePresence>
          
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Cards;
