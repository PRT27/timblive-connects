import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileCard from '@/components/ProfileCard';
import PromotionalProfiles from '@/components/PromotionalProfiles';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Music, BookOpen, Tv, Briefcase, MoreHorizontal, Star } from 'lucide-react';

// Sample profiles
const sampleProfiles = [
  {
    id: 'sam-altman',
    name: 'Sam Altman',
    role: 'CEO, OpenAI',
    bio: 'Discussing the latest in AI technology and the future of OpenAI.',
    avatar: 'https://avatars.githubusercontent.com/u/3412640',
    tags: ['AI', 'Technology', 'Business'],
    featured: true
  },
  {
    id: 'mark-zuckerberg',
    name: 'Mark Zuckerberg',
    role: 'CEO, Meta',
    bio: 'Exploring the Meta universe and the latest on Llama 3.3.',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg',
    tags: ['AI', 'Technology', 'Meta'],
    featured: true
  },
  {
    id: 'thuso-mbedo',
    name: 'Thuso Mbedo',
    role: 'Actress & Podcaster',
    bio: 'Sharing insights on acting and entertainment industry.',
    avatar: 'https://images.mubicdn.net/images/cast_member/842214/cache-590465-1602840566/image-w856.jpg',
    tags: ['Entertainment', 'Podcast', 'Acting'],
    featured: true
  },
  {
    id: 'khutso-theledi',
    name: 'Khutso Theledi',
    role: 'Radio Host',
    bio: 'Radio personality sharing the latest in music and culture.',
    avatar: 'https://i0.wp.com/www.sabc.co.za/sabc/wp-content/uploads/2023/05/unnamed-3.jpg',
    tags: ['Radio', 'Music', 'Entertainment'],
    featured: false
  },
  {
    id: 'tyla',
    name: 'Tyla',
    role: 'Musician',
    bio: 'Grammy-winning artist sharing new music and performances.',
    avatar: 'https://yt3.googleusercontent.com/RX5UJjQlkemsGaUSzsLNWNgU_zhJZVzIcn3FYCTQxGMPhY5N_ZiPBPgq21RQA4Pi7YnIeWzT5Q=s900-c-k-c0x00ffffff-no-rj',
    tags: ['Music', 'Performance', 'Entertainment'],
    featured: true
  },
  {
    id: 'kendrick-lamar',
    name: 'Kendrick Lamar',
    role: 'Musician',
    bio: 'Award-winning artist sharing music and insights.',
    avatar: 'https://media.pitchfork.com/photos/5edecf23c9f5c38dae1bd21e/1:1/w_1080,h_1080,c_limit/Kendrick%20Lamar.jpg',
    tags: ['Music', 'Hip Hop', 'Entertainment'],
    featured: false
  },
  {
    id: 'sza',
    name: 'SZA',
    role: 'Musician',
    bio: 'R&B artist sharing new music and performances.',
    avatar: 'https://media.allure.com/photos/6486da06adc95a3ebf38e6b2/1:1/w_1440,h_1440,c_limit/061323-sza.jpg',
    tags: ['Music', 'R&B', 'Entertainment'],
    featured: false
  }
];

// Content categories
const categories = [
  { id: 'music', name: 'Music', icon: Music },
  { id: 'education', name: 'Education', icon: BookOpen },
  { id: 'entertainment', name: 'Entertainment', icon: Tv },
  { id: 'business', name: 'Business', icon: Briefcase },
  { id: 'more', name: 'More', icon: MoreHorizontal }
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter profiles based on search query and category
  const filteredProfiles = sampleProfiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         profile.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         profile.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeCategory === 'all') return matchesSearch;
    
    return matchesSearch && profile.tags.some(tag => 
      tag.toLowerCase() === activeCategory.toLowerCase()
    );
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Explore Content</h1>
            
            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                type="text"
                placeholder="Search for creators, content, or tags"
                className="pl-10 py-6 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Categories */}
            <div className="mb-8">
              <Tabs defaultValue="all" onValueChange={setActiveCategory}>
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="promoted">
                    <Star className="h-4 w-4 mr-2" />
                    Featured Live
                  </TabsTrigger>
                  {categories.map(category => (
                    <TabsTrigger key={category.id} value={category.id.toLowerCase()}>
                      <category.icon className="h-4 w-4 mr-2" />
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {/* Featured Live Streamers Tab */}
                <TabsContent value="promoted" className="mt-0">
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-semibold mb-2">Featured Live Streamers</h2>
                      <p className="text-gray-600">Discover amazing live content from our promoted creators</p>
                    </div>
                    <PromotionalProfiles showAssociateButton={false} />
                  </div>
                </TabsContent>
                
                {/* Featured Content */}
                <TabsContent value="all" className="mt-0">
                  {filteredProfiles.length > 0 ? (
                    <>
                      {filteredProfiles.some(profile => profile.featured) && (
                        <>
                          <h2 className="text-xl font-semibold mb-4">Featured Creators</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {filteredProfiles
                              .filter(profile => profile.featured)
                              .map(profile => (
                                <ProfileCard key={profile.id} profile={profile} />
                              ))}
                          </div>
                        </>
                      )}
                      
                      <h2 className="text-xl font-semibold mb-4">All Creators</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredProfiles.map(profile => (
                          <ProfileCard key={profile.id} profile={profile} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-16">
                      <p className="text-gray-500 mb-4">No results found for "{searchQuery}"</p>
                      <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
                    </div>
                  )}
                </TabsContent>
                
                {/* Category Tabs */}
                {categories.map(category => (
                  <TabsContent key={category.id} value={category.id.toLowerCase()} className="mt-0">
                    {filteredProfiles.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredProfiles.map(profile => (
                          <ProfileCard key={profile.id} profile={profile} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <p className="text-gray-500 mb-4">No results found in {category.name} category</p>
                        <Button onClick={() => setActiveCategory('all')}>View All Categories</Button>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Explore;
