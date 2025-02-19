"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./styles.css";
import { Pagination } from "swiper/modules";
import ProductCard from "./ProductCard"; // Adjust the path as necessary

export default function App() {
  return (
    <>
      <Swiper
          breakpoints={
            JSON.stringify({
            960: {
              slidesPerView: 4,
              spaceBetween: 8
            },
            720: {
              slidesPerView: 3,
              spaceBetween: 6
            },
            540: {
              slidesPerView: 2,
              spaceBetween: 4
            },
            320: {
              slidesPerView: 1,
              spaceBetween: 2
            }
          })
        }
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className="mySwiper"
      >
        <SwiperSlide><ProductCard /></SwiperSlide>
        <SwiperSlide><ProductCard /></SwiperSlide>
        <SwiperSlide><ProductCard /></SwiperSlide>
        <SwiperSlide><ProductCard /></SwiperSlide>
        <SwiperSlide><ProductCard /></SwiperSlide>
        <SwiperSlide><ProductCard /></SwiperSlide>
        <SwiperSlide><ProductCard /></SwiperSlide>
        <SwiperSlide><ProductCard /></SwiperSlide>
        <SwiperSlide><ProductCard /></SwiperSlide>
      </Swiper>
    </>
  );
}
