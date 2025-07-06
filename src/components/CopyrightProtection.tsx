
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
import { Shield, AlertTriangle, Eye, FileText, DollarSign } from 'lucide-react';

interface CopyrightClaim {
  id: string;
  content_type: string;
  content_id: string;
  claim_type: string;
  status: string;
  description: string;
  created_at: string;
}

interface CopyrightStatus {
  total_claims: number;
  active_claims: number;
  content_licenses: number;
  ad_requests: number;
}

const CopyrightProtection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [claims, setClaims] = useState<CopyrightClaim[]>([]);
  const [status, setStatus] = useState<CopyrightStatus | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Form state for new claim
  const [contentType, setContentType] = useState('stream');
  const [contentId, setContentId] = useState('');
  const [claimType, setClaimType] = useState('dmca');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (user) {
      fetchCopyrightData();
    }
  }, [user]);

  const fetchCopyrightData = async () => {
    if (!user) return;

    try {
      // Fetch copyright claims
      const { data: claimsData, error: claimsError } = await supabase
        .from('copyright_claims')
        .select('*')
        .eq('content_owner_id', user.id)
        .order('created_at', { ascending: false });

      if (claimsError) throw claimsError;
      setClaims(claimsData || []);

      // Fetch copyright status
      const { data: statusData, error: statusError } = await supabase.rpc('get_user_copyright_status', {
        user_uuid: user.id
      });

      if (statusError) throw statusError;
      if (statusData && statusData.length > 0) {
        setStatus(statusData[0]);
      }
    } catch (error) {
      console.error('Error fetching copyright data:', error);
    }
  };

  const createCopyrightClaim = async () => {
    if (!user || !contentId.trim() || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.rpc('create_copyright_claim', {
        owner_uuid: user.id,
        content_type_param: contentType,
        content_uuid: contentId,
        claim_description: description,
        evidence_urls_param: []
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "Copyright Claim Filed",
          description: "Your copyright claim has been successfully submitted.",
          variant: "default",
        });

        // Reset form
        setContentId('');
        setDescription('');
        
        // Refresh data
        fetchCopyrightData();
      }
    } catch (error) {
      console.error('Error creating copyright claim:', error);
      toast({
        title: "Failed to File Claim",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'resolved':
        return <Badge className="bg-blue-500">Resolved</Badge>;
      case 'disputed':
        return <Badge className="bg-orange-500">Disputed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dmca':
        return <Shield className="h-4 w-4" />;
      case 'copyright':
        return <FileText className="h-4 w-4" />;
      case 'trademark':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Please sign in to access copyright protection features.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Copyright Status Overview */}
      {status && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{status.total_claims}</div>
              <div className="text-sm text-gray-600">Total Claims</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Eye className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <div className="text-2xl font-bold">{status.active_claims}</div>
              <div className="text-sm text-gray-600">Active Claims</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <FileText className="h-8 w-8 mx-auto text-purple-500 mb-2" />
              <div className="text-2xl font-bold">{status.content_licenses}</div>
              <div className="text-sm text-gray-600">Licenses</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 mx-auto text-orange-500 mb-2" />
              <div className="text-2xl font-bold">{status.ad_requests}</div>
              <div className="text-sm text-gray-600">Ad Requests</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* File New Copyright Claim */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            File Copyright Claim
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="content-type">Content Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger id="content-type">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stream">Live Stream</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="podcast">Podcast</SelectItem>
                  <SelectItem value="broadcast">Broadcast</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="claim-type">Claim Type</Label>
              <Select value={claimType} onValueChange={setClaimType}>
                <SelectTrigger id="claim-type">
                  <SelectValue placeholder="Select claim type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dmca">DMCA Takedown</SelectItem>
                  <SelectItem value="copyright">Copyright Infringement</SelectItem>
                  <SelectItem value="trademark">Trademark Violation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content-id">Content ID</Label>
            <Input
              id="content-id"
              value={contentId}
              onChange={(e) => setContentId(e.target.value)}
              placeholder="Enter the ID of your protected content"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the copyright infringement and provide details"
              rows={4}
            />
          </div>
          
          <Button 
            onClick={createCopyrightClaim} 
            disabled={loading || !contentId.trim() || !description.trim()}
            className="w-full"
          >
            <Shield className="h-4 w-4 mr-2" />
            {loading ? 'Filing Claim...' : 'File Copyright Claim'}
          </Button>
        </CardContent>
      </Card>

      {/* Copyright Claims List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Copyright Claims</CardTitle>
        </CardHeader>
        <CardContent>
          {claims.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No copyright claims filed yet.</p>
          ) : (
            <div className="space-y-4">
              {claims.map((claim) => (
                <div key={claim.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(claim.claim_type)}
                      <span className="font-medium capitalize">{claim.claim_type} Claim</span>
                    </div>
                    {getStatusBadge(claim.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Content Type:</span> {claim.content_type}
                    </div>
                    <div>
                      <span className="font-medium">Content ID:</span> {claim.content_id}
                    </div>
                  </div>
                  
                  <p className="text-sm">{claim.description}</p>
                  
                  <div className="text-xs text-gray-500">
                    Filed: {new Date(claim.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CopyrightProtection;
