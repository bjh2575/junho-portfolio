import Image from "next/image";
import { motion } from "framer-motion";
// components
import AnimatedText from "./AnimatedText";

const About = () => {
  return (
    <section className="relative pt-12 pb-24" id="about">
      <div className="container mx-aito h-full">
        <div className="h-full flex items-center justify-center">
          {/* image + shapes */}
          <div className="hidden xl:flex flex-1 pl-8">
            <div className="relative w-full max-w-[380px]">
              {/* shape */}
              <div className="w-[160px] h-[160px] bg-accent absolute -left-5 -top-5 -z-10">
                {/* image */}
              </div>  
              <div className="rounded-tl-[8px] rounded-tr-[120px] w-full bg-[#e5f8f6] ming-h-[480px] flex items-end justify-center">
                  <Image 
                    src="/assets/about/junho.png" 
                    width={350} 
                    height={478} 
                    quality={100} 
                    priority 
                    alt="" 
                  />
              </div>              
              {/* rotating shape */}
              <div className="absolute top-2/4 -right-[65px] flex items-center justify-center">
                <motion.div animate={{
                  rotate: [0,360],                 
                }} 
                transition={{
                  duration: 10, 
                  ease: "linear", 
                  repeat:Infinity,
                  }}
                >
                 <Image 
                    src="/assets/about/shape-1.svg" 
                    width={160}
                   height={160}
                    alt=""
                />
                </motion.div>
                <div className="absolute text-center text-white">
                  <div className="text-5xl font-bold leading-none">1+</div>
                  <div className="leading-none text-center">                  
                    Years of <br /> Experince 
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* text */}
          <div className="text-center xl:text-left w-full xl:w-[50%] mx-auto xl:mx-0 flex flex-col gap-6">
            <div>
              <AnimatedText text="My name is JunHo" textStyles="h2 mb-2"/>
              <p className="text-lg">사이버 보안 운영 및 위협 대응 전문가 </p>
            </div>
            <p className="max-w-[680px] mx-auto xl:mx-0 mb-2">
            저는 현재 보안 관제 업무를 수행 중입니다. 
            사이버 보안의 최전선에서 네트워크와 시스템의 안전을 유지하며, 잠재적인 위협을 식별하고 대응하는 역할을 수행합니다. 
            이 과정에서 기술적 분석, 위협 탐지, 그리고 신속한 의사결정이 요구되는 중요한 위치에서 활동하고 있습니다.
            </p>
            {/* info items */}
            <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 max-w-max mx-auto xl:mx-0 items-center">
              {/* item 1 */}
              <div className="max-w-max">
                <div className="uppercase font-bold text-primary">Age</div>
                <p>1998.09.21</p>
              </div>
              {/* item 2 */}
              <div className="max-w-max">
                <div className="uppercase font-bold text-primary">Born in</div>
                <p>Seoul, South Korea</p>
              </div>
              {/* item 3 */}
              <div className="max-w-max">
                <div className="uppercase font-bold text-primary">Phone</div>
                <p>+82 10-3176-2572</p>
              </div>
              {/* item 4 */}
              <div className="max-w-max">
                <div className="uppercase font-bold text-primary">Email</div>
                <p>wns921@naver.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
