
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Play, Square, Users, Eye } from 'lucide-react';

interface Stream {
  id: string;
  title: string;
  description: string;
  stream_type: string;
  status: string;
  viewer_count: number;
  likes_count: number;
  tags: string[];
  started_at: string;
  created_at: string;
}

const StreamManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeStreams, setActiveStreams] = useState<Stream[]>([]);
  const [userStreams, setUserStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [streamType, setStreamType] = useState('live');
  const [tags, setTags] = useState('');

  useEffect(() => {
    fetchActiveStreams();
    if (user) {
      fetchUserStreams();
    }
  }, [user]);

  const fetchActiveStreams = async () => {
    try {
      const { data, error } = await supabase.rpc('get_active_streams');
      
      if (error) {
        console.error('Error fetching active streams:', error);
        return;
      }

      setActiveStreams(data || []);
    } catch (error) {
      console.error('Error fetching active streams:', error);
    }
  };

  const fetchUserStreams = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('streams')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user streams:', error);
        return;
      }

      setUserStreams(data || []);
    } catch (error) {
      console.error('Error fetching user streams:', error);
    }
  };

  const createStream = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a stream.",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your stream.",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);

    try {
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      
      const { data, error } = await supabase.rpc('create_stream', {
        user_uuid: user.id,
        stream_title: title,
        stream_description: description || null,
        stream_type_param: streamType,
        stream_tags: tagArray
      });

      if (error) {
        throw error;
      }

      if (data) {
        toast({
          title: "Stream Created",
          description: "Your stream has been created and is now live!",
          variant: "default",
        });

        // Reset form
        setTitle('');
        setDescription('');
        setTags('');
        
        // Refresh streams
        fetchActiveStreams();
        fetchUserStreams();
      }
    } catch (error) {
      console.error('Error creating stream:', error);
      toast({
        title: "Failed to Create Stream",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const updateStreamStatus = async (streamId: string, newStatus: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('update_stream_status', {
        stream_uuid: streamId,
        new_status: newStatus
      });

      if (error) {
        throw error;
      }

      if (data) {
        toast({
          title: newStatus === 'ended' ? "Stream Ended" : "Stream Updated",
          description: `Your stream has been ${newStatus}.`,
          variant: "default",
        });

        fetchActiveStreams();
        fetchUserStreams();
      }
    } catch (error) {
      console.error('Error updating stream status:', error);
      toast({
        title: "Failed to Update Stream",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-red-500 animate-pulse">LIVE</Badge>;
      case 'scheduled':
        return <Badge variant="outline">Scheduled</Badge>;
      case 'ended':
        return <Badge variant="secondary">Ended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Create New Stream */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Stream</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Stream Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter stream title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stream-type">Stream Type</Label>
                <Select value={streamType} onValueChange={setStreamType}>
                  <SelectTrigger id="stream-type">
                    <SelectValue placeholder="Select stream type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="live">Live Stream</SelectItem>
                    <SelectItem value="podcast">Podcast</SelectItem>
                    <SelectItem value="broadcast">Broadcast</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your stream"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="tech, tutorial, live coding"
              />
            </div>
            
            <Button 
              onClick={createStream} 
              disabled={creating || !title.trim()}
              className="w-full bg-red-500 hover:bg-red-600"
            >
              <Play className="h-4 w-4 mr-2" />
              {creating ? 'Creating Stream...' : 'Go Live'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active Streams */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Active Streams ({activeStreams.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeStreams.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No active streams at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeStreams.map((stream) => (
                <div key={stream.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{stream.title}</h3>
                    {getStatusBadge(stream.status)}
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">{stream.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {stream.viewer_count}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {stream.stream_type}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {stream.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User's Streams */}
      {user && userStreams.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Streams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userStreams.map((stream) => (
                <div key={stream.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{stream.title}</h3>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(stream.status)}
                      {stream.status === 'active' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateStreamStatus(stream.id, 'ended')}
                        >
                          <Square className="h-4 w-4 mr-1" />
                          End Stream
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">{stream.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {stream.viewer_count} viewers
                    </div>
                    <span>Created: {new Date(stream.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StreamManager;
