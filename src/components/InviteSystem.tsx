import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Copy, CheckCircle, Users, UserPlus, Mail, Send } from 'lucide-react';

const InviteSystem = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState('TIMBL-' + Math.random().toString(36).substring(2, 10).toUpperCase());
  const [copiedInvite, setCopiedInvite] = useState(false);
  const { toast } = useToast();

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // This would connect to your backend/API to send the invite
      // For now, we'll just simulate a successful invite
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Invitation sent",
        description: `Your invitation has been sent to ${email}`,
        variant: "default",
      });
      
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error sending invite:', error);
      toast({
        title: "Failed to send invitation",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const copyInviteLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/signup?invite=${inviteCode}`);
    setCopiedInvite(true);
    
    toast({
      title: "Invite link copied",
      description: "The invite link has been copied to your clipboard",
      variant: "default",
    });
    
    // Reset copied state after 3 seconds
    setTimeout(() => setCopiedInvite(false), 3000);
  };
  
  const generateNewInviteCode = () => {
    setInviteCode('TIMBL-' + Math.random().toString(36).substring(2, 10).toUpperCase());
    
    toast({
      title: "New invite code generated",
      description: "Your invite code has been refreshed",
      variant: "default",
    });
  };
  
  const switchToSendTab = () => {
    // Find the send tab and activate it
    const sendTab = document.querySelector('[data-state="inactive"][value="send"]') as HTMLElement;
    if (sendTab) {
      (sendTab as HTMLElement).click();
    }
  };

  // Mock data for recent invites
  const recentInvites = [
    { id: 1, email: 'friend@example.com', status: 'pending', date: '2 days ago' },
    { id: 2, email: 'colleague@example.com', status: 'accepted', date: '5 days ago' },
    { id: 3, email: 'contact@example.com', status: 'accepted', date: '1 week ago' },
  ];
  
  return (
    <Tabs defaultValue="send" className="w-full">
      <TabsList className="bg-[#151530] border border-[#0077FF]/30 mb-6">
        <TabsTrigger value="send" className="data-[state=active]:bg-[#0077FF] data-[state=active]:text-white">
          Send Invites
        </TabsTrigger>
        <TabsTrigger value="link" className="data-[state=active]:bg-[#0077FF] data-[state=active]:text-white">
          Share Link
        </TabsTrigger>
        <TabsTrigger value="history" className="data-[state=active]:bg-[#0077FF] data-[state=active]:text-white">
          Invite History
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="send">
        <Card className="bg-[#0a0a1f]/80 backdrop-blur-xl border border-[#0077FF]/30 text-white shadow-lg shadow-[#0077FF]/20">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Mail className="mr-2 h-5 w-5 text-[#0077FF]" />
              Send Email Invitations
            </CardTitle>
            <CardDescription className="text-gray-400">
              Invite friends and colleagues to join TiMBLive
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSendInvite} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="friend@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#151530]/60 border-[#0077FF]/30 text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-300">Personal Message (Optional)</Label>
                <textarea 
                  id="message" 
                  placeholder="Join me on TiMBLive for amazing content..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full min-h-[100px] p-3 rounded-md bg-[#151530]/60 border border-[#0077FF]/30 text-white focus:outline-none focus:ring-2 focus:ring-[#0077FF]"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-2 bg-[#0077FF] hover:bg-[#33c3f0] text-white"
                disabled={loading}
              >
                {loading ? (
                  <>Sending... <Send className="ml-2 h-4 w-4 animate-pulse" /></>
                ) : (
                  <>Send Invitation <Send className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="link">
        <Card className="bg-[#0a0a1f]/80 backdrop-blur-xl border border-[#0077FF]/30 text-white shadow-lg shadow-[#0077FF]/20">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <UserPlus className="mr-2 h-5 w-5 text-[#0077FF]" />
              Share Invite Link
            </CardTitle>
            <CardDescription className="text-gray-400">
              Generate and share an invite link with multiple people
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="invite-link" className="text-gray-300">Your Unique Invite Link</Label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Input 
                    id="invite-link" 
                    value={`${window.location.origin}/signup?invite=${inviteCode}`}
                    readOnly
                    className="pr-10 bg-[#151530]/60 border-[#0077FF]/30 text-white"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={copyInviteLink}
                  >
                    {copiedInvite ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <Button 
                  type="button"
                  variant="outline"
                  className="border-[#0077FF]/50 text-[#0077FF] hover:bg-[#0077FF]/20"
                  onClick={generateNewInviteCode}
                >
                  Refresh
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Share Instantly</h3>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-[#1877F2] hover:bg-[#1877F2]/80">
                  Facebook
                </Button>
                <Button className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/80">
                  Twitter
                </Button>
                <Button className="bg-[#25D366] hover:bg-[#25D366]/80">
                  WhatsApp
                </Button>
                <Button className="bg-[#0A66C2] hover:bg-[#0A66C2]/80">
                  LinkedIn
                </Button>
                <Button className="bg-[#7289DA] hover:bg-[#7289DA]/80">
                  Discord
                </Button>
              </div>
            </div>
            
            <div className="bg-[#151530]/40 rounded-lg p-4 border border-[#0077FF]/20">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0077FF]/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-[#0077FF]" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Referral Rewards</h4>
                  <p className="text-sm text-gray-400">Earn special badges and unlock premium features for each friend who joins</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="history">
        <Card className="bg-[#0a0a1f]/80 backdrop-blur-xl border border-[#0077FF]/30 text-white shadow-lg shadow-[#0077FF]/20">
          <CardHeader>
            <CardTitle className="text-white">Invite History</CardTitle>
            <CardDescription className="text-gray-400">
              Track who you've invited and their status
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {recentInvites.length > 0 ? (
                <div className="divide-y divide-[#0077FF]/10">
                  {recentInvites.map((invite) => (
                    <div key={invite.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-[#0077FF]/30">
                          <AvatarFallback className="bg-[#151530] text-[#0077FF]">
                            {invite.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{invite.email}</p>
                          <p className="text-xs text-gray-400">Invited {invite.date}</p>
                        </div>
                      </div>
                      <div>
                        {invite.status === 'accepted' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-500 border border-green-500/30">
                            <CheckCircle className="mr-1 h-3 w-3" /> Joined
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#0077FF]/20 text-[#0077FF] border border-[#0077FF]/30">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserPlus className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-white">No invites yet</h3>
                  <p className="text-gray-400 mb-4">Start inviting friends to join TiMBLive</p>
                  <Button 
                    onClick={switchToSendTab}
                    className="bg-[#0077FF] hover:bg-[#33c3f0] text-white"
                  >
                    Send Your First Invite
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="border-t border-[#0077FF]/20 pt-4">
            <div className="w-full flex justify-between items-center">
              <span className="text-sm text-gray-400">Total Invites: {recentInvites.length}</span>
              <span className="text-sm text-gray-400">
                Accepted: {recentInvites.filter(invite => invite.status === 'accepted').length}
              </span>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default InviteSystem;
