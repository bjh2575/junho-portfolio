import Image from "next/image";
import { PiSecurityCameraFill } from "react-icons/pi";
import { MdOutlineSecurity } from "react-icons/md";
import { FaHandshake } from "react-icons/fa";
import { AiOutlineSolution } from "react-icons/ai";



const services = [
  {
    icon: PiSecurityCameraFill,
    title: "위협 탐지 및 분석",
    description: "네트워크와 시스템에서 발생하는 이상 징후를 탐지하고, 이를 분석하여 잠재적 위협을 파악.",
  },
  {
    icon: MdOutlineSecurity,
    title: "보안 사고 대응",
    description: "침해 사고 발생 시 신속한 대응과 해결책 제공.",
  },
  {
    icon: AiOutlineSolution,
    title: "보안 솔루션 운영 및 관리",
    description: "SIEM 등 보안 솔루션을 활용해 데이터를 분석하고 경고를 처리.",
  },
  {
    icon: FaHandshake,
    title: "협업과 커뮤니케이션",
    description: "다른 IT 부서 및 외부 전문가와 협력하여 통합적 보안 전략 실행.",
  },
]

const Services = () => {
  return (
    <section className="relative z-40">
      <div className="container mx-auto">
        <ul className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[20px] -top-12 place-items-center lg:place-items-stretch">
          {services.map((service, index)=>{
            const Icon = service.icon ;
            return (
              <li key={index} className="bg-white shadow-custom p-6 max-w-[350px] md:max-w-none rounded-lg">
                {typeof Icon === "function" ? (
                  <Icon size={48} className="mb-4 text-primary" /> // React 아이콘
                ) : (
                <Image 
                  src={Icon} 
                  width={48} 
                  height={48} 
                  alt="" 
                  className="mb-4"
                  />
                )}
                  <h3 className="text-[20px] text-primary font-semibold mb-3">
                    {service.title}
                  </h3>
                  <p className="text-[15px]">
                    {service.description}
                  </p>
              </li>
            ); 
          })}
        </ul>
      </div>
    </section>
  );
};

export default Services;
