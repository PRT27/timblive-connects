
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Users, Mail, Copy, CheckCircle } from 'lucide-react';

const InviteSystem: React.FC = () => {
  const [email, setEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [sentInvites, setSentInvites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const { toast } = useToast();
  
  // Generate an invite link when the component mounts
  React.useEffect(() => {
    const baseUrl = window.location.origin;
    const uniqueCode = Math.random().toString(36).substring(2, 10);
    setInviteLink(`${baseUrl}/signup?invite=${uniqueCode}`);
  }, []);
  
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, you would send this via your backend
      // For now, we'll simulate sending and track it locally
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network request
      
      setSentInvites([...sentInvites, email]);
      setEmail('');
      
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${email}.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Failed to send invitation",
        description: "There was an error sending the invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    
    toast({
      title: "Link copied",
      description: "Invitation link copied to clipboard.",
      variant: "default",
    });
    
    setTimeout(() => setLinkCopied(false), 3000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-timbl" />
          Invite Friends to TiMBLive
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email invitation form */}
        <form onSubmit={handleSendInvite} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email Address</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="invite-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="friend@example.com"
                  className="pl-9"
                />
              </div>
              <Button 
                type="submit" 
                className="bg-timbl hover:bg-timbl-600"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Invite'}
              </Button>
            </div>
          </div>
        </form>
        
        {/* Invitation link */}
        <div className="space-y-2">
          <Label>Share Invitation Link</Label>
          <div className="flex gap-2">
            <Input value={inviteLink} readOnly className="bg-gray-50" />
            <Button 
              type="button" 
              variant="outline" 
              className="flex-shrink-0"
              onClick={handleCopyLink}
            >
              {linkCopied ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Share this link with friends to invite them to join TiMBLive
          </p>
        </div>
        
        {/* Sent invitations */}
        {sentInvites.length > 0 && (
          <div className="space-y-2">
            <Label>Recent Invitations</Label>
            <div className="rounded-md border">
              <div className="p-3 border-b bg-gray-50">
                <span className="text-sm font-medium">Email</span>
              </div>
              <div className="divide-y">
                {sentInvites.map((invitedEmail, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <span className="text-sm">{invitedEmail}</span>
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      Sent
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start text-sm text-gray-500">
        <p>
          Invite friends and colleagues to join you on TiMBLive. They'll receive a special link to sign up.
        </p>
      </CardFooter>
    </Card>
  );
};

export default InviteSystem;
