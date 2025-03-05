
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Play, Radio, Mic, Users } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-timbl-700 via-timbl-600 to-timbl-400"
        style={{ zIndex: -2 }}
      />
      
      {/* Decorative circles */}
      <div 
        className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-timbl-300 opacity-20 blur-3xl"
        style={{ zIndex: -1 }}
      />
      <div 
        className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-timbl-200 opacity-20 blur-3xl"
        style={{ zIndex: -1 }}
      />
      
      <div className="container pt-28 pb-16 md:pt-40 md:min-h-screen md:flex md:flex-col md:justify-center">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-6 md:space-y-8">
            <div className="inline-block animate-fade-in">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
                Revolutionizing Content Creation
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight animate-fade-in-down" style={{ animationDelay: '0.1s' }}>
              Connect with Your Audience in Real-Time
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
              TiMBLive combines live streaming, podcasting, and broadcasting with interactive features, storage, and monetization options for content creators.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/signup">
                <Button size="lg" className="rounded-full px-8 py-6 bg-white text-timbl-700 hover:bg-white/90 shadow-lg">
                  Get Started
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-white border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20">
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Feature highlights */}
          <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="glass-card rounded-2xl p-6 text-white">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Play className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Live Streaming</h3>
              <p className="text-white/70 text-sm">Share your events with a global audience in real-time</p>
            </div>
            
            <div className="glass-card rounded-2xl p-6 text-white">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Mic className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Podcasting</h3>
              <p className="text-white/70 text-sm">Host your podcast and reach a wider audience</p>
            </div>
            
            <div className="glass-card rounded-2xl p-6 text-white">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Radio className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Broadcasting</h3>
              <p className="text-white/70 text-sm">Share your message with a targeted audience</p>
            </div>
            
            <div className="glass-card rounded-2xl p-6 text-white">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Users className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Monetization</h3>
              <p className="text-white/70 text-sm">Earn through subscriptions, ads, and sponsorships</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
