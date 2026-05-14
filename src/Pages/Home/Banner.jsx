import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router";

export default function Banner() {
  const slides = [
    {
      id: 1,
      title: "Report Public Issues Easily",
      subtitle: "Streetlights • Potholes • Water Leakage • Broken Footpaths",
      image:
        "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?w=1400",
    },
    {
      id: 2,
      title: "Your Voice Matters",
      subtitle: "Raise issues & help build a better community",
      image:
        "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=1400",
    },
    {
      id: 3,
      title: "Track Issue Status in Real-Time",
      subtitle: "Stay updated with government action",
      image:
        "https://images.unsplash.com/photo-1500048993959-dc56b8f4c221?w=1400",
    },
  ];

  return (
    <div className="w-full h-[80vh]">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 2800,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="w-full h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

              {/* Text Content */}
              <div className="absolute top-1/2 left-10 transform -translate-y-1/2 text-white max-w-xl">
                <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>
                <p className="text-lg mb-6">{slide.subtitle}</p>

                <Link to="/reportIssue" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg">
                  Report Issue Now
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
