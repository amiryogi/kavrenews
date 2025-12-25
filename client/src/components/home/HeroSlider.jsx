import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { NewsCardFeatured } from '../common/NewsCard';
import { newsAPI } from '../../services/api';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HeroSlider = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await newsAPI.getFeatured(5);
        setNews(data.data);
      } catch (error) {
        console.error('Failed to fetch featured news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <div className="h-96 md:h-[500px] skeleton rounded-xl" />
    );
  }

  if (news.length === 0) {
    return null;
  }

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      loop={news.length > 1}
      className="rounded-xl overflow-hidden"
    >
      {news.map((item) => (
        <SwiperSlide key={item._id}>
          <NewsCardFeatured news={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroSlider;
