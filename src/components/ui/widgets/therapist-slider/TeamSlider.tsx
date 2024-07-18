import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import TherapistSingleRounded from "./TherapistSingleRounded";

interface DataType {
  title: string;

  imgSrc: any;
}

const data: DataType[] = [
  {
    title: "Camry K.",
    imgSrc: "/images/avatars/1.png",
  },
  {
    title: "Camry K.",
    imgSrc: "/images/avatars/1.png",
  },
  {
    title: "Camry K.",
    imgSrc: "/images/avatars/1.png",
  },
  {
    title: "Camry K.",
    imgSrc: "/images/avatars/1.png",
  },
  {
    title: "Camry K.",
    imgSrc: "/images/avatars/1.png",
  },
  {
    title: "Camry K.",
    imgSrc: "/images/avatars/1.png",
  },
  {
    title: "Camry K.",
    imgSrc: "/images/avatars/1.png",
  },
  {
    title: "Camry K.",
    imgSrc: "/images/avatars/1.png",
  },
  {
    title: "Camry K.",
    imgSrc: "/images/avatars/1.png",
  },
  {
    title: "Camry K.",
    imgSrc: "/images/avatars/1.png",
  },
  {
    title: "Camry K.",
    imgSrc: "/images/avatars/1.png",
  },
  {
    title: "Camry K.",
    imgSrc: "/images/avatars/1.png",
  },
  {
    title: "Camry K.",
    imgSrc: "/images/avatars/1.png",
  },
  {
    title: "Camry K.",
    imgSrc: "/images/avatars/1.png",
  },
  {
    title: "Camry K.",
    imgSrc: "/images/avatars/1.png",
  },
  {
    title: "Camry K.",
    imgSrc: "/images/avatars/1.png",
  },
  {
    title: "Camry K.",
    imgSrc: "/images/avatars/1.png",
  },
];
const TeamSlider = () => {
  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={10}
      breakpoints={{
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 15.5,
          spaceBetween: 24,
        },
      }}
      className="mySwiper"
    >
      {data.map((item, index) => {
        return (
          <SwiperSlide key={index}>
            <TherapistSingleRounded image={item.imgSrc} name={item.title} />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default TeamSlider;
