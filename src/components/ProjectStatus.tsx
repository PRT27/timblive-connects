
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const ProjectStatus = () => {
  // Project readiness data for TiMBLive
  const features = [
    { name: "User Authentication", status: "complete", percentage: 100 },
    { name: "Profile Management", status: "complete", percentage: 100 },
    { name: "Password Reset", status: "complete", percentage: 100 },
    { name: "External Stream Integration", status: "complete", percentage: 100 },
    { name: "Content Creation", status: "in-progress", percentage: 75 },
    { name: "Live Streaming", status: "in-progress", percentage: 70 },
    { name: "Invite System", status: "complete", percentage: 100 },
    { name: "UI/UX Design", status: "in-progress", percentage: 85 },
    { name: "Mobile Responsiveness", status: "in-progress", percentage: 80 },
    { name: "Analytics", status: "planned", percentage: 30 },
  ];
  
  // Calculate overall project readiness
  const totalFeatures = features.length;
  const completedFeatures = features.filter(feature => feature.status === "complete").length;
  const inProgressFeatures = features.filter(feature => feature.status === "in-progress").length;
  
  const overallPercentage = features.reduce((sum, feature) => sum + feature.percentage, 0) / totalFeatures;
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return <Badge className="bg-green-500/20 text-green-500 border border-green-500/30">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-[#0077FF]/20 text-[#0077FF] border border-[#0077FF]/30">In Progress</Badge>;
      case "planned":
        return <Badge className="bg-gray-500/20 text-gray-400 border border-gray-500/30">Planned</Badge>;
      default:
        return null;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-[#0077FF]" />;
      case "planned":
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-[#0a0a1f]/80 backdrop-blur-xl border border-[#0077FF]/30 text-white shadow-lg shadow-[#0077FF]/20">
      <CardHeader>
        <CardTitle className="text-white">TiMBLive Project Status</CardTitle>
        <CardDescription className="text-gray-400">
          Current status and deployment readiness
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Overall Readiness</h3>
            <span className="text-2xl font-bold text-[#33c3f0]">{Math.round(overallPercentage)}%</span>
          </div>
          
          <Progress value={overallPercentage} className="h-3 bg-[#151530]">
            <div 
              className="h-full bg-gradient-to-r from-[#0077FF] to-[#33c3f0] rounded-full" 
              style={{ width: `${overallPercentage}%` }} 
            />
          </Progress>
          
          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>Development</span>
            <span>Testing</span>
            <span>Deployment</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-[#151530]/40 rounded-lg p-4 border border-[#0077FF]/20">
            <h4 className="font-medium text-white mb-2">Feature Status</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-300">Completed: {completedFeatures}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#0077FF]"></div>
                <span className="text-gray-300">In Progress: {inProgressFeatures}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span className="text-gray-300">Planned: {totalFeatures - completedFeatures - inProgressFeatures}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#151530]/40 rounded-lg p-4 border border-[#0077FF]/20">
            <h4 className="font-medium text-white mb-2">Deployment Readiness</h4>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#0a0a1f] border-4 border-[#0077FF]">
                <span className="text-xl font-bold text-[#33c3f0]">85%</span>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-white">The platform is <span className="text-[#33c3f0] font-medium">nearly ready</span> for testing</p>
                <p className="text-gray-400">Recommend user acceptance testing</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium text-white mb-3">Feature Breakdown</h4>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-md bg-[#151530]/40 border border-[#0077FF]/20"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(feature.status)}
                  <span className="font-medium text-gray-300">{feature.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={feature.percentage} className="w-24 h-2 bg-[#151530]">
                    <div 
                      className={`h-full rounded-full ${
                        feature.status === "complete" 
                          ? "bg-green-500" 
                          : feature.status === "in-progress" 
                            ? "bg-[#0077FF]" 
                            : "bg-gray-500"
                      }`} 
                      style={{ width: `${feature.percentage}%` }} 
                    />
                  </Progress>
                  {getStatusBadge(feature.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectStatus;
