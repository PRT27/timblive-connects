import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Facebook, ExternalLink, Share2 } from 'lucide-react';

const FacebookStreamIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [facebookPageUrl, setFacebookPageUrl] = useState('https://www.facebook.com/share/19cTDG1pKZ/');
  const [streamKey, setStreamKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConnectFacebook = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to connect Facebook streaming.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Save Facebook integration to database
      const { data, error } = await supabase
        .from('stream_integrations')
        .upsert({
          user_id: user.id,
          platform: 'facebook',
          stream_url: facebookPageUrl,
          is_active: true
        }, {
          onConflict: 'user_id,platform'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setIsConnected(true);
      toast({
        title: "Facebook Connected",
        description: "Your Facebook page has been connected for streaming.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error connecting Facebook:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect Facebook. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartFacebookStream = async () => {
    if (!streamKey) {
      toast({
        title: "Stream Key Required",
        description: "Please enter your Facebook stream key to start streaming.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a new stream in the database
      const { data, error } = await supabase.rpc('create_stream', {
        user_uuid: user.id,
        stream_title: 'Live Stream to Facebook',
        stream_description: 'Broadcasting live to Facebook',
        stream_type_param: 'facebook_live',
        stream_tags: ['Facebook', 'Live']
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Stream Started",
        description: "Your Facebook live stream has started! Share the link with your audience.",
        variant: "default",
      });

      // Open Facebook page in new window
      window.open(facebookPageUrl, '_blank');
    } catch (error) {
      console.error('Error starting Facebook stream:', error);
      toast({
        title: "Stream Failed",
        description: "Failed to start Facebook stream. Please check your stream key.",
        variant: "destructive",
      });
    }
  };

  const checkFacebookConnection = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('stream_integrations')
        .select('*')
        .eq('user_id', user.id)
        .eq('platform', 'facebook')
        .eq('is_active', true)
        .single();

      if (data && !error) {
        setIsConnected(true);
        setFacebookPageUrl(data.stream_url);
      }
    } catch (error) {
      // No existing connection
      setIsConnected(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkFacebookConnection();
    }
  }, [user]);

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Facebook className="h-6 w-6" />
          Facebook Live Integration
        </CardTitle>
        <CardDescription className="text-blue-100">
          Stream directly to your Facebook page and reach your audience
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="facebook-url" className="text-white">Facebook Page URL</Label>
            <div className="flex gap-2">
              <Input
                id="facebook-url"
                value={facebookPageUrl}
                onChange={(e) => setFacebookPageUrl(e.target.value)}
                placeholder="https://www.facebook.com/your-page"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button
                variant="outline"
                size="icon"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => window.open(facebookPageUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isConnected ? (
            <Button
              onClick={handleConnectFacebook}
              disabled={loading}
              className="w-full bg-white text-blue-600 hover:bg-white/90"
            >
              {loading ? 'Connecting...' : 'Connect Facebook Page'}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-sm text-green-100">✓ Facebook page connected successfully</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stream-key" className="text-white">Facebook Stream Key (Optional)</Label>
                <Input
                  id="stream-key"
                  type="password"
                  value={streamKey}
                  onChange={(e) => setStreamKey(e.target.value)}
                  placeholder="Enter your Facebook Live stream key"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <p className="text-xs text-blue-100">
                  Get your stream key from Facebook Creator Studio → Live Producer
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleStartFacebookStream}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Start Live Stream
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.open(facebookPageUrl, '_blank')}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Facebook
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/20 pt-4">
          <h3 className="font-medium mb-2">How to Stream to Facebook:</h3>
          <ol className="text-sm text-blue-100 space-y-1 list-decimal list-inside">
            <li>Go to your Facebook page</li>
            <li>Click "Create" → "Live Video"</li>
            <li>Choose "Use Stream Key" option</li>
            <li>Copy the stream key and paste it above</li>
            <li>Start your stream from TiMBLive</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacebookStreamIntegration;