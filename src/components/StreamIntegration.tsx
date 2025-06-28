
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Facebook, Instagram, Youtube, Twitter, Link, Globe } from 'lucide-react';

interface StreamIntegration {
  id: string;
  platform: string;
  stream_url: string;
  is_active: boolean;
}

const StreamIntegration = () => {
  const { user } = useAuth();
  const [platform, setPlatform] = useState('youtube');
  const [streamUrl, setStreamUrl] = useState('');
  const [integrations, setIntegrations] = useState<StreamIntegration[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchIntegrations();
    }
  }, [user]);

  const fetchIntegrations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('stream_integrations')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching integrations:', error);
        return;
      }

      setIntegrations(data || []);
    } catch (error) {
      console.error('Error fetching integrations:', error);
    }
  };

  const handleAddIntegration = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add integrations.",
        variant: "destructive",
      });
      return;
    }

    if (!streamUrl) {
      toast({
        title: "Missing URL",
        description: "Please enter a valid stream URL",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('stream_integrations')
        .insert({
          user_id: user.id,
          platform,
          stream_url: streamUrl,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setIntegrations([...integrations, data]);
      setStreamUrl('');
      
      toast({
        title: "Integration added",
        description: `Your ${getPlatformName(platform)} stream has been integrated`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error adding integration:', error);
      toast({
        title: "Failed to add integration",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveIntegration = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('stream_integrations')
        .update({ is_active: false })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setIntegrations(integrations.filter(integration => integration.id !== id));
      toast({
        title: "Integration removed",
        description: "The stream integration has been removed",
        variant: "default",
      });
    } catch (error) {
      console.error('Error removing integration:', error);
      toast({
        title: "Failed to remove integration",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };
  
  const getPlatformIcon = (platformName: string) => {
    switch (platformName) {
      case 'youtube':
        return <Youtube className="h-5 w-5 text-red-500" />;
      case 'facebook':
        return <Facebook className="h-5 w-5 text-blue-500" />;
      case 'instagram':
        return <Instagram className="h-5 w-5 text-pink-500" />;
      case 'twitter':
        return <Twitter className="h-5 w-5 text-sky-500" />;
      case 'other':
        return <Globe className="h-5 w-5 text-purple-500" />;
      default:
        return <Link className="h-5 w-5" />;
    }
  };
  
  const getPlatformName = (platformId: string) => {
    const platforms: {[key: string]: string} = {
      'youtube': 'YouTube',
      'facebook': 'Facebook',
      'instagram': 'Instagram',
      'twitter': 'X (Twitter)',
      'other': 'Other'
    };
    
    return platforms[platformId] || platformId;
  };

  if (!user) {
    return (
      <Card className="bg-[#0a0a1f]/80 backdrop-blur-xl border border-[#0077FF]/30 text-white shadow-lg shadow-[#0077FF]/20">
        <CardContent className="pt-6">
          <p className="text-gray-400 text-center">Please sign in to manage stream integrations.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#0a0a1f]/80 backdrop-blur-xl border border-[#0077FF]/30 text-white shadow-lg shadow-[#0077FF]/20">
      <CardHeader>
        <CardTitle className="text-white">External Stream Integration</CardTitle>
        <CardDescription className="text-gray-400">
          Connect your existing streams from other platforms
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="platform" className="text-gray-300">Platform</Label>
            <Select 
              value={platform} 
              onValueChange={setPlatform}
            >
              <SelectTrigger id="platform" className="bg-[#151530]/60 border-[#0077FF]/30 text-white">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent className="bg-[#151530] border-[#0077FF]/30 text-white">
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="twitter">X (Twitter)</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="streamUrl" className="text-gray-300">Stream URL</Label>
            <div className="flex gap-2">
              <Input 
                id="streamUrl" 
                placeholder="https://..."
                value={streamUrl}
                onChange={(e) => setStreamUrl(e.target.value)}
                className="flex-1 bg-[#151530]/60 border-[#0077FF]/30 text-white"
              />
              <Button 
                onClick={handleAddIntegration}
                disabled={loading}
                className="bg-[#0077FF] hover:bg-[#33c3f0] text-white"
              >
                {loading ? 'Adding...' : 'Add'}
              </Button>
            </div>
          </div>
        </div>
        
        {integrations.length > 0 && (
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-medium text-white">Your Integrations</h3>
            
            <div className="space-y-3">
              {integrations.map((integration) => (
                <div
                  key={integration.id}
                  className="flex items-center justify-between p-3 rounded-md bg-[#151530]/60 border border-[#0077FF]/20"
                >
                  <div className="flex items-center gap-3">
                    {getPlatformIcon(integration.platform)}
                    <div>
                      <p className="font-medium text-white">{getPlatformName(integration.platform)}</p>
                      <p className="text-sm text-gray-400 truncate max-w-[200px] sm:max-w-xs">
                        {integration.stream_url}
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-[#0077FF]/10"
                    onClick={() => handleRemoveIntegration(integration.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t border-[#0077FF]/20 pt-6">
        <div className="text-sm text-gray-400">
          <p>Stream your content from other platforms directly to TiMBLive.</p>
          <p className="mt-1">Supported platforms: YouTube, Facebook, Instagram, X (Twitter), and more.</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StreamIntegration;
