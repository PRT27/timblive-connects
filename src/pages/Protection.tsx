
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CopyrightProtection from '@/components/CopyrightProtection';
import AdvertisingAgency from '@/components/AdvertisingAgency';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Building } from 'lucide-react';

const Protection = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Content Protection & Business</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Protect your content from unauthorized use and manage advertising opportunities 
              with our comprehensive protection and business tools.
            </p>
          </div>

          <Tabs defaultValue="copyright" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="copyright" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Copyright Protection
              </TabsTrigger>
              <TabsTrigger value="advertising" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Advertising Agency
              </TabsTrigger>
            </TabsList>

            <TabsContent value="copyright" className="space-y-6">
              <CopyrightProtection />
            </TabsContent>

            <TabsContent value="advertising" className="space-y-6">
              <AdvertisingAgency />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Protection;
