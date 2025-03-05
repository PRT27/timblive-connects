
import React, { useEffect } from 'react';
import FeatureCard from './FeatureCard';
import { 
  Video, Radio, Mic, MessageSquare, Database, DollarSign, 
  Music, Upload, BarChart4, Share2, Bell, Globe 
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Video,
      title: "Live Streaming",
      description: "Share your events, concerts, and meetings with a global audience in real-time with high-quality video."
    },
    {
      icon: Mic,
      title: "Podcasting",
      description: "Host your podcast on TiMBLive and reach a wider audience with professional audio tools and distribution."
    },
    {
      icon: Radio,
      title: "Broadcasting",
      description: "Share your message with a targeted audience using our powerful broadcasting tools and analytics."
    },
    {
      icon: MessageSquare,
      title: "Interactive Features",
      description: "Engage with your audience through live comments, Q&A, and polls to create meaningful connections."
    },
    {
      icon: Database,
      title: "Storage Solutions",
      description: "Store your live videos for up to a month and short clips for over a year with secure cloud storage."
    },
    {
      icon: DollarSign,
      title: "Monetization",
      description: "Earn money through subscriptions, ads, and sponsorships with our flexible monetization options."
    },
    {
      icon: Music,
      title: "For Musicians",
      description: "Upload your music videos and grow your fanbase while earning competitive streaming rates."
    },
    {
      icon: Upload,
      title: "Easy Uploads",
      description: "Quickly upload and share your content with our intuitive interface and fast processing."
    },
    {
      icon: BarChart4,
      title: "Analytics",
      description: "Track your performance with detailed analytics and insights about your audience engagement."
    },
    {
      icon: Share2,
      title: "Social Sharing",
      description: "Easily share your content across social platforms to maximize your reach and impact."
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Keep your audience informed with automated notifications about your upcoming streams and new content."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connect with audiences worldwide with our global content delivery network and translation tools."
    }
  ];

  // Add scroll animation logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const featureElements = document.querySelectorAll('.feature-card');
    featureElements.forEach((el) => observer.observe(el));

    return () => {
      featureElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Powerful Features for Content Creators</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to create, share, and monetize your content in one powerful platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div className="feature-card opacity-0" key={index}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
