
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight, Check, Video, Headphones, Radio, Users, DollarSign, Play } from 'lucide-react';

const Index = () => {
  // For audiences section
  const audiences = [
    {
      title: "Journalists",
      description: "Share breaking news and connect with your audience in real-time",
      features: ["Live reporting", "Interactive Q&A", "Content archives", "Subscription model"]
    },
    {
      title: "Musicians",
      description: "Stream performances and monetize your music content",
      features: ["High-quality streaming", "Music video hosting", "Fan engagement tools", "Fair revenue sharing"]
    },
    {
      title: "Event Promoters",
      description: "Broadcast events to global audiences and analyze engagement",
      features: ["Multi-camera streaming", "Ticket integration", "Audience analytics", "Event archives"]
    },
    {
      title: "Content Creators",
      description: "Create, share, and monetize your unique content",
      features: ["Customizable channels", "Cross-platform sharing", "Monetization options", "Growth analytics"]
    }
  ];

  return (
    <div className="page-content min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-timbl mb-2">10K+</div>
              <p className="text-gray-600">Active Creators</p>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-timbl mb-2">1M+</div>
              <p className="text-gray-600">Monthly Viewers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-timbl mb-2">30K+</div>
              <p className="text-gray-600">Hours Streamed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-timbl mb-2">150+</div>
              <p className="text-gray-600">Countries Reached</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <Features />
      
      {/* For Different Audiences Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Designed for Every Creator</h2>
            <p className="text-lg text-muted-foreground">
              Whether you're a journalist, musician, event promoter, or content creator, TiMBLive has the tools you need.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {audiences.map((audience, index) => (
              <div 
                key={index}
                className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="text-xl font-semibold mb-3">{audience.title}</h3>
                <p className="text-gray-600 mb-6">{audience.description}</p>
                
                <ul className="space-y-3">
                  {audience.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-timbl shrink-0 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How TiMBLive Works</h2>
            <p className="text-lg text-muted-foreground">
              Get started in minutes with our simple, intuitive platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-timbl-100 flex items-center justify-center mb-6">
                <span className="text-timbl text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Sign Up</h3>
              <p className="text-gray-600">
                Create your account using your Google account or phone number.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-timbl-100 flex items-center justify-center mb-6">
                <span className="text-timbl text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Customize</h3>
              <p className="text-gray-600">
                Set up your channel with your branding and preferences.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-timbl-100 flex items-center justify-center mb-6">
                <span className="text-timbl text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Go Live</h3>
              <p className="text-gray-600">
                Start streaming, podcasting, or broadcasting to your audience.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-timbl-700 text-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Content Creation?</h2>
            <p className="text-xl text-white/80 mb-8">
              Join the TiMBLive community today and start creating, connecting, and earning!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="rounded-full px-8 py-6 bg-white text-timbl-700 hover:bg-white/90">
                  Get Started
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-white border-white/30 bg-white/10 hover:bg-white/20">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
