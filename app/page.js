import CallToAction from './components/home/callAction';
import Courses from './components/home/courses';
import FaqSection from './components/home/faqSection';
import WhyChooseUs from './components/home/features';
import Hero from './components/home/heroSection';

export default function Home() {
  return (
    <div className="bg-white text-blue-900">
      {/* Hero Section */}
      <Hero />

      {/* Course Offerings Section */}
      <Courses />

      {/* Features Section */}
      <WhyChooseUs />

      {/* FAQ Section */}
      <FaqSection />

      {/* Call to Action Section */}
      <CallToAction />
    </div>
  );
}
