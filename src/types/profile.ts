
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
}
