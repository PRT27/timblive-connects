
export interface ProfileType {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  coverImage?: string;
  organization?: string;
  tags: string[];
  featured?: boolean;
  
  // Add missing properties
  username?: string;
  displayName?: string;
  location?: string;
  email?: string;
  bannerUrl?: string;
  avatarUrl?: string;
  website?: string;
}
