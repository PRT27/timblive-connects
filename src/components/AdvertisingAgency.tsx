
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Building, Check, Clock, X, DollarSign } from 'lucide-react';

interface Agency {
  id: string;
  company_name: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  verification_status: string;
  created_at: string;
}

interface AdRequest {
  id: string;
  content_type: string;
  content_id: string;
  proposed_price: number;
  campaign_description: string;
  status: string;
  created_at: string;
}

const AdvertisingAgency = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [adRequests, setAdRequests] = useState<AdRequest[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form state for agency registration
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [website, setWebsite] = useState('');

  useEffect(() => {
    if (user) {
      fetchAgencyData();
    }
  }, [user]);

  const fetchAgencyData = async () => {
    if (!user) return;

    try {
      // Fetch agency profile
      const { data: agencyData, error: agencyError } = await supabase
        .from('advertising_agencies')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (agencyError && agencyError.code !== 'PGRST116') {
        throw agencyError;
      }
      
      setAgency(agencyData);

      // Fetch ad requests if agency exists
      if (agencyData) {
        const { data: requestsData, error: requestsError } = await supabase
          .from('ad_space_requests')
          .select('*')
          .eq('agency_id', agencyData.id)
          .order('created_at', { ascending: false });

        if (requestsError) throw requestsError;
        setAdRequests(requestsData || []);
      }
    } catch (error) {
      console.error('Error fetching agency data:', error);
    }
  };

  const registerAgency = async () => {
    if (!user || !companyName.trim() || !contactEmail.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.rpc('register_advertising_agency', {
        user_uuid: user.id,
        company_name_param: companyName,
        contact_email_param: contactEmail,
        business_license_param: null,
        website_param: website || null
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "Agency Registered",
          description: "Your advertising agency has been registered and is pending verification.",
          variant: "default",
        });

        // Reset form
        setCompanyName('');
        setContactEmail('');
        setContactPhone('');
        setWebsite('');
        
        // Refresh data
        fetchAgencyData();
      }
    } catch (error) {
      console.error('Error registering agency:', error);
      toast({
        title: "Registration Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" />Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500"><X className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Please sign in to access advertising agency features.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {!agency ? (
        // Agency Registration Form
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Register as Advertising Agency
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name *</Label>
                <Input
                  id="company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter your company name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email *</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Enter contact email"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input
                  id="contact-phone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Enter contact phone number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourcompany.com"
                />
              </div>
            </div>
            
            <Button 
              onClick={registerAgency} 
              disabled={loading || !companyName.trim() || !contactEmail.trim()}
              className="w-full"
            >
              <Building className="h-4 w-4 mr-2" />
              {loading ? 'Registering...' : 'Register Agency'}
            </Button>
            
            <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
              <p><strong>Note:</strong> After registration, your agency will be reviewed and verified before you can start requesting ad space from content creators.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Agency Dashboard
        <>
          {/* Agency Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {agency.company_name}
                </div>
                {getStatusBadge(agency.verification_status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Contact Email</p>
                  <p className="font-medium">{agency.contact_email}</p>
                </div>
                {agency.contact_phone && (
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{agency.contact_phone}</p>
                  </div>
                )}
                {agency.website && (
                  <div>
                    <p className="text-sm text-gray-600">Website</p>
                    <a href={agency.website} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-500 hover:underline">
                      {agency.website}
                    </a>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Registered</p>
                  <p className="font-medium">{new Date(agency.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              {agency.verification_status === 'pending' && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-800">Your agency is pending verification. You'll be able to request ad space once verified.</p>
                </div>
              )}
              
              {agency.verification_status === 'rejected' && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <p className="text-red-800">Your agency verification was rejected. Please contact support for more information.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ad Space Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Ad Space Requests ({adRequests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {adRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No ad space requests yet.</p>
              ) : (
                <div className="space-y-4">
                  {adRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">{request.content_type}</span>
                          <span className="text-gray-500">#{request.content_id}</span>
                        </div>
                        {getRequestStatusBadge(request.status)}
                      </div>
                      
                      <p className="text-sm">{request.campaign_description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Proposed: ${request.proposed_price}</span>
                        <span>Requested: {new Date(request.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdvertisingAgency;
