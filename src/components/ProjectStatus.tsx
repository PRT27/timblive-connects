
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface FeatureStatusProps {
  feature: string;
  status: 'completed' | 'in-progress' | 'pending';
  description: string;
}

const FeatureStatus: React.FC<FeatureStatusProps> = ({ feature, status, description }) => {
  return (
    <div className="flex items-start gap-3 py-3">
      {status === 'completed' && (
        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
      )}
      {status === 'in-progress' && (
        <Clock className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
      )}
      {status === 'pending' && (
        <AlertCircle className="h-5 w-5 text-gray-300 mt-0.5 flex-shrink-0" />
      )}
      
      <div>
        <h4 className="font-medium text-gray-900">{feature}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const ProjectStatus: React.FC = () => {
  // Calculate project completion percentage
  const completedFeatures = 9; // Update as needed
  const totalFeatures = 12; // Update as needed
  const completionPercentage = Math.round((completedFeatures / totalFeatures) * 100);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>TiMBLive Platform Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Completion</span>
            <span className="text-sm font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} />
          
          <div className="flex justify-between text-xs text-gray-500 pt-1">
            <span>Development Phase</span>
            <span>Ready for Deployment</span>
          </div>
        </div>
        
        <div className="space-y-1 pt-2">
          <h3 className="font-semibold text-gray-800">Feature Status</h3>
          
          <div className="divide-y">
            <FeatureStatus 
              feature="User Authentication" 
              status="completed" 
              description="Sign up, sign in, and password reset functionality with Supabase."
            />
            <FeatureStatus 
              feature="User Profiles" 
              status="completed" 
              description="Profile creation, management, and customization."
            />
            <FeatureStatus 
              feature="Live Streaming" 
              status="completed" 
              description="Native live streaming capabilities for content creators."
            />
            <FeatureStatus 
              feature="External Platform Integration" 
              status="completed" 
              description="Integration with YouTube, Facebook, Instagram, and other platforms."
            />
            <FeatureStatus 
              feature="Podcasting" 
              status="completed" 
              description="Upload and stream audio content on the platform."
            />
            <FeatureStatus 
              feature="Content Discovery" 
              status="completed" 
              description="Explore and discover relevant content across the platform."
            />
            <FeatureStatus 
              feature="Content Broadcasting" 
              status="completed" 
              description="Schedule and broadcast content to your audience."
            />
            <FeatureStatus 
              feature="Invite System" 
              status="completed" 
              description="Invite friends and colleagues to join the platform."
            />
            <FeatureStatus 
              feature="Content Monetization" 
              status="in-progress" 
              description="Tools for creators to monetize their content."
            />
            <FeatureStatus 
              feature="Analytics Dashboard" 
              status="in-progress" 
              description="Detailed analytics for creators to track performance."
            />
            <FeatureStatus 
              feature="Mobile App" 
              status="pending" 
              description="Native mobile applications for iOS and Android."
            />
            <FeatureStatus 
              feature="API for Developers" 
              status="pending" 
              description="Developer APIs for custom integrations."
            />
          </div>
        </div>
        
        <div className="pt-2">
          <h3 className="font-semibold text-gray-800 mb-2">Deployment Readiness Assessment</h3>
          <div className="bg-green-50 border border-green-100 rounded-md p-4">
            <h4 className="font-medium text-green-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              75% Ready for Testing Deployment
            </h4>
            <p className="text-sm text-green-700 mt-1">
              The TiMBLive platform is ready for initial testing deployment. Core features are functional, with a few features still in active development.
            </p>
            <div className="mt-3 text-sm text-green-700">
              <p><strong>Next Steps:</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Deploy to a staging environment for comprehensive testing</li>
                <li>Complete the monetization system implementation</li>
                <li>Finalize analytics dashboard for content creators</li>
                <li>Begin planning for mobile app development</li>
              </ul>
            </div>
            <p className="text-sm italic text-green-700 mt-3">
              Expected timeline to 100% completion: 4-6 weeks
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectStatus;
