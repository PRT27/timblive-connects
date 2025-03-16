
import React, { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { ProfileType } from '@/types/profile';

interface ProfileEditorProps {
  onCancel: () => void;
  onSave: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ onCancel, onSave }) => {
  const { mainProfile, updateMainProfile } = useProfile();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(mainProfile.name);
  const [bio, setBio] = useState(mainProfile.bio);
  const [role, setRole] = useState(mainProfile.role);
  const [organization, setOrganization] = useState(mainProfile.organization || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [previewCover, setPreviewCover] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(mainProfile.tags);
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewCover(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const uploadFile = async (file: File, path: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file);
    
    if (uploadError) {
      throw uploadError;
    }
    
    const { data } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  };
  
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    const newTag = tagInput.trim();
    if (!tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setTagInput('');
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updates: Partial<ProfileType> = {
        name,
        bio,
        role,
        organization: organization || undefined,
        tags
      };
      
      // Handle avatar upload if changed
      if (avatarFile) {
        const avatarUrl = await uploadFile(avatarFile, 'avatars');
        updates.avatar = avatarUrl;
      }
      
      // Handle cover image upload if changed
      if (coverImageFile) {
        const coverUrl = await uploadFile(coverImageFile, 'covers');
        updates.coverImage = coverUrl;
      }
      
      await updateMainProfile(updates);
      
      toast({
        title: "Profile updated",
        description: "Your profile changes have been saved.",
        variant: "default",
      });
      
      onSave();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const dateOfBirth = new Date(1988, 0, 1); // January 1, 1988
  const age = new Date().getFullYear() - dateOfBirth.getFullYear();
  
  return (
    <Card className="bg-[#0a0a1f]/60 backdrop-blur-xl border border-[#0077FF]/30 text-white shadow-lg shadow-[#0077FF]/20">
      <CardHeader>
        <CardTitle className="text-white">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image */}
          <div className="space-y-2">
            <Label className="text-gray-300">Cover Image</Label>
            <div 
              className="h-48 bg-[#151530]/60 rounded-md overflow-hidden relative"
              style={{
                backgroundImage: previewCover 
                  ? `url(${previewCover})` 
                  : mainProfile.coverImage 
                    ? `url(${mainProfile.coverImage})` 
                    : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <label 
                htmlFor="cover-upload" 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
              >
                <div className="bg-[#0077FF] rounded-full p-2">
                  <Upload className="h-6 w-6 text-white" />
                </div>
              </label>
              <input 
                id="cover-upload" 
                type="file" 
                accept="image/*" 
                className="sr-only" 
                onChange={handleCoverImageChange} 
              />
            </div>
          </div>
          
          {/* Avatar */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-[#0077FF]">
                <AvatarImage 
                  src={previewAvatar || mainProfile.avatar} 
                  alt={name} 
                />
                <AvatarFallback className="text-2xl bg-[#151530] text-[#0077FF]">{name.charAt(0)}</AvatarFallback>
              </Avatar>
              <label 
                htmlFor="avatar-upload" 
                className="absolute -right-2 -bottom-2 bg-[#0077FF] hover:bg-[#33c3f0] text-white p-1.5 rounded-full cursor-pointer"
              >
                <Upload className="h-4 w-4" />
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="sr-only" 
                onChange={handleAvatarChange} 
              />
            </div>
            <div>
              <p className="text-sm text-gray-300">
                Upload a new profile picture
              </p>
              <p className="text-xs text-gray-400">
                JPG, PNG or GIF. 1MB max.
              </p>
            </div>
          </div>
          
          {/* Personal Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Full Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Your full name"
                required
                className="bg-[#151530]/60 border-[#0077FF]/30 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-300">Role</Label>
              <Input 
                id="role" 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                placeholder="e.g. Developer, Designer, Creator"
                className="bg-[#151530]/60 border-[#0077FF]/30 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization" className="text-gray-300">Organization</Label>
            <Input 
              id="organization" 
              value={organization} 
              onChange={(e) => setOrganization(e.target.value)} 
              placeholder="Your company or organization"
              className="bg-[#151530]/60 border-[#0077FF]/30 text-white"
            />
          </div>
                  
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-gray-300">Bio</Label>
            <Textarea 
              id="bio" 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              placeholder="Tell others about yourself"
              rows={4}
              className="bg-[#151530]/60 border-[#0077FF]/30 text-white"
            />
          </div>
          
          <div>
            <p className="text-sm text-[#33c3f0]">
              {`Age: ${age} years (Born: January 1, 1988)`}
            </p>
          </div>
          
          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-gray-300">Content Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1 bg-[#151530] text-[#33c3f0] border border-[#0077FF]/30">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input 
                id="tags" 
                value={tagInput} 
                onChange={(e) => setTagInput(e.target.value)} 
                placeholder="Add content tags..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="bg-[#151530]/60 border-[#0077FF]/30 text-white"
              />
              <Button 
                type="button" 
                onClick={handleAddTag}
                variant="outline"
                className="border-[#0077FF]/50 text-[#0077FF] hover:bg-[#0077FF]/20"
              >
                Add
              </Button>
            </div>
            <p className="text-xs text-gray-400">Press Enter or click Add to add a tag</p>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button 
          variant="outline"
          onClick={onCancel}
          className="border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#0077FF] hover:bg-[#33c3f0] text-white"
        >
          {loading ? (
            <>Saving... <Check className="ml-2 h-4 w-4 animate-spin" /></>
          ) : (
            <>Save Changes <Check className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileEditor;
