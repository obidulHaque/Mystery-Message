import Image from "next/image";
import React from "react";

function Footer() {
  return (
    <>
      <div className="flex justify-center items-center lg:mt-[9vw] mt-[40vw]">
        <Image src="/image.png" alt="x" width={1000} height={100} />
      </div>
      <div className="relative  w-full h-[30vh] text-white dark:text-black flex px-10 py-10 lg:h-screen mt-24">
        <div className="w-1/2   ">
          {/* <div className='text-[6vw] leading-[6vw] -tracking-[0.1em] font-["Segoe UI Symbol"]'>
            <p>EYE-</p>
            <p>OPENING</p>
          </div> */}
          <div className="absolute top-[82%] left-8 text-[4vw] ">
            <p>JOY</p>
          </div>
        </div>
        <div className="w-1/2 px-10 py-8 relative ">
          <div className=" absolute -top-[70%] left-[3%] lg:top-[20%]  ">
            {/* <p className='text-[6vw] leading-[2vw]  font-["Segoe UI Symbol"] -tracking-[0.1em]'>
              PRESENTATIONS
            </p> */}
            <div className="px-2 py-10">
              {[
                { name: "S:" },
                { name: "GitHub", link: "https://github.com/obidulHaque" },
                {
                  name: "YouTube",
                  link: "https://www.youtube.com/channel/UCHnMFuu-ek3I7jtQfLWQhqw",
                },
                {
                  name: "Linkedin",
                  link: "https://www.linkedin.com/in/md-obidul-haque-3ba641255/",
                },
              ].map((items, index) => (
                <a
                  className={`block ${index === 1 && "mt-8"} ${
                    index === 0 && "mt-10"
                  } underline`}
                  href={items.link}
                  key={index}
                >
                  {items.name}{" "}
                </a>
              ))}
            </div>
          </div>
          <div className="absolute top-[90%] lg:left-8 left-0 flex text-zinc-400 text-[1.5vw]">
            <p>&copy;JOY design 2024.</p>
            <p className="underline">legal Trems</p>
          </div>
          <div className="absolute top-[90%] lg:left-[80%] left-24 text-zinc-400 lg:text-[1.1vw] text-[2vw]">
            <p className="flex">
              Website by Obidul Haque{" "}
              <Image
                src={"/myPhoto.jpeg"}
                alt="my photo"
                width={100}
                height={100}
                className="rounded-full lg:w-[2.5vw] w-[2vw] overflow-hidden"
              />
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
