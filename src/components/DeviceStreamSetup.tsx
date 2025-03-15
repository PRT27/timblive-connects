
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import StreamShareLink from './StreamShareLink';
import { Mic, MicOff, Camera, CameraOff, Monitor, MonitorOff, Settings, Volume2, ScreenShare, Cast } from 'lucide-react';

interface DeviceStreamSetupProps {
  streamId: string;
  onStreamStart?: () => void;
  onStreamEnd?: () => void;
  streamType?: 'live' | 'podcast' | 'broadcast' | 'video';
}

const DeviceStreamSetup: React.FC<DeviceStreamSetupProps> = ({ 
  streamId, 
  onStreamStart, 
  onStreamEnd,
  streamType = 'live'
}) => {
  const [isLive, setIsLive] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>('');
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [audioLevel, setAudioLevel] = useState(75);
  const [viewerCount, setViewerCount] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const screenStream = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  
  // Helper for requesting camera/microphone permissions
  const requestMediaPermissions = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const audioDevices = devices.filter(device => device.kind === 'audioinput');
      
      setCameras(videoDevices);
      setMicrophones(audioDevices);
      
      if (videoDevices.length > 0) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
      
      if (audioDevices.length > 0) {
        setSelectedMicrophone(audioDevices[0].deviceId);
      }
    } catch (error) {
      console.error('Error enumerating media devices:', error);
      toast({
        title: "Permissions Required",
        description: "Please allow camera and microphone access to stream.",
        variant: "destructive",
      });
    }
  };
  
  useEffect(() => {
    requestMediaPermissions();
    
    // Simulation of viewership 
    if (isLive) {
      const interval = setInterval(() => {
        setViewerCount(prev => Math.min(prev + Math.floor(Math.random() * 5), 1000));
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [isLive]);
  
  const startCamera = async () => {
    try {
      if (mediaStream.current) {
        stopMediaTracks(mediaStream.current);
      }
      
      const constraints: MediaStreamConstraints = {
        video: selectedCamera ? { deviceId: { exact: selectedCamera } } : true,
        audio: selectedMicrophone ? { deviceId: { exact: selectedMicrophone } } : true
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStream.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsCameraEnabled(true);
      setIsMicEnabled(true);
      
      toast({
        title: "Camera Active",
        description: "Your camera and microphone are now active.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error starting camera:', error);
      toast({
        title: "Camera Error",
        description: "Could not access camera or microphone.",
        variant: "destructive",
      });
    }
  };
  
  const toggleCamera = () => {
    if (!mediaStream.current) {
      startCamera();
      return;
    }
    
    const videoTracks = mediaStream.current.getVideoTracks();
    videoTracks.forEach(track => {
      track.enabled = !isCameraEnabled;
    });
    
    setIsCameraEnabled(!isCameraEnabled);
  };
  
  const toggleMicrophone = () => {
    if (!mediaStream.current) {
      startCamera();
      return;
    }
    
    const audioTracks = mediaStream.current.getAudioTracks();
    audioTracks.forEach(track => {
      track.enabled = !isMicEnabled;
    });
    
    setIsMicEnabled(!isMicEnabled);
  };
  
  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing && screenStream.current) {
        stopMediaTracks(screenStream.current);
        
        if (videoRef.current && mediaStream.current) {
          videoRef.current.srcObject = mediaStream.current;
        }
        
        setIsScreenSharing(false);
        return;
      }
      
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true,
        audio: false
      });
      
      screenStream.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsScreenSharing(true);
      
      // Handle user ending the screen share through browser UI
      stream.getVideoTracks()[0].onended = () => {
        setIsScreenSharing(false);
        if (videoRef.current && mediaStream.current) {
          videoRef.current.srcObject = mediaStream.current;
        }
      };
      
      toast({
        title: "Screen Sharing Active",
        description: "You are now sharing your screen.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error sharing screen:', error);
      toast({
        title: "Screen Sharing Error",
        description: "Could not share your screen.",
        variant: "destructive",
      });
    }
  };
  
  const stopMediaTracks = (stream: MediaStream) => {
    stream.getTracks().forEach(track => {
      track.stop();
    });
  };
  
  const startLiveStream = () => {
    if (!streamTitle.trim()) {
      toast({
        title: "Stream Title Required",
        description: "Please enter a title for your stream.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLive(true);
    setViewerCount(1);
    
    if (onStreamStart) {
      onStreamStart();
    }
    
    toast({
      title: "Live Stream Started",
      description: "Your stream is now live! Others can now join and watch.",
      variant: "default",
    });
  };
  
  const endLiveStream = () => {
    setIsLive(false);
    
    if (onStreamEnd) {
      onStreamEnd();
    }
    
    toast({
      title: "Stream Ended",
      description: "Your live stream has ended. Thanks for streaming!",
      variant: "default",
    });
  };
  
  const handleAudioLevelChange = (value: number[]) => {
    setAudioLevel(value[0]);
    // In a real implementation, this would adjust the gain of the audio track
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-[#0a0a1f]/80 backdrop-blur-xl border border-[#0077FF]/30 text-white shadow-lg shadow-[#0077FF]/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-white">
            {isLive ? (
              <div className="flex items-center">
                Live Stream 
                <Badge className="ml-2 bg-red-500 animate-pulse">LIVE</Badge>
                <Badge className="ml-2 bg-[#0077FF]/70">{viewerCount} viewers</Badge>
              </div>
            ) : (
              `${streamType.charAt(0).toUpperCase() + streamType.slice(1)} Setup`
            )}
          </CardTitle>
          
          {!isLive && (
            <div className="flex items-center gap-2">
              <StreamShareLink streamId={streamId} streamType={streamType} />
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#0077FF]/10">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          {!isLive && (
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="stream-title" className="text-gray-300">Stream Title</Label>
                <Input 
                  id="stream-title"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  placeholder="Enter your stream title"
                  className="bg-[#151530]/60 border-[#0077FF]/30 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stream-description" className="text-gray-300">Description (optional)</Label>
                <Input 
                  id="stream-description"
                  value={streamDescription}
                  onChange={(e) => setStreamDescription(e.target.value)}
                  placeholder="Describe your stream"
                  className="bg-[#151530]/60 border-[#0077FF]/30 text-white"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="camera" className="text-gray-300">Camera</Label>
                  <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                    <SelectTrigger id="camera" className="bg-[#151530]/60 border-[#0077FF]/30 text-white">
                      <SelectValue placeholder="Select camera" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#151530] border-[#0077FF]/30 text-white">
                      {cameras.map(camera => (
                        <SelectItem key={camera.deviceId} value={camera.deviceId}>
                          {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="microphone" className="text-gray-300">Microphone</Label>
                  <Select value={selectedMicrophone} onValueChange={setSelectedMicrophone}>
                    <SelectTrigger id="microphone" className="bg-[#151530]/60 border-[#0077FF]/30 text-white">
                      <SelectValue placeholder="Select microphone" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#151530] border-[#0077FF]/30 text-white">
                      {microphones.map(mic => (
                        <SelectItem key={mic.deviceId} value={mic.deviceId}>
                          {mic.label || `Microphone ${microphones.indexOf(mic) + 1}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          
          <div className="aspect-video bg-black rounded-lg mb-4 relative overflow-hidden">
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              muted
              className="w-full h-full object-cover"
            />
            
            {!mediaStream.current && !isLive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <Camera className="h-16 w-16 mb-4 opacity-20" />
                <Button onClick={startCamera} variant="default" className="bg-[#0077FF] hover:bg-[#0077FF]/90">
                  Start Camera
                </Button>
              </div>
            )}
            
            {isScreenSharing && (
              <Badge className="absolute top-2 left-2 bg-purple-500 text-white">
                Screen Sharing
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              variant={isCameraEnabled ? "default" : "outline"}
              size="sm"
              onClick={toggleCamera}
              className={isCameraEnabled ? "bg-[#0077FF] hover:bg-[#0077FF]/90" : "text-gray-400 hover:text-white"}
              disabled={!mediaStream.current && !isCameraEnabled}
            >
              {isCameraEnabled ? <Camera className="h-4 w-4 mr-2" /> : <CameraOff className="h-4 w-4 mr-2" />}
              {isCameraEnabled ? "Camera On" : "Camera Off"}
            </Button>
            
            <Button 
              variant={isMicEnabled ? "default" : "outline"}
              size="sm"
              onClick={toggleMicrophone}
              className={isMicEnabled ? "bg-[#0077FF] hover:bg-[#0077FF]/90" : "text-gray-400 hover:text-white"}
              disabled={!mediaStream.current && !isMicEnabled}
            >
              {isMicEnabled ? <Mic className="h-4 w-4 mr-2" /> : <MicOff className="h-4 w-4 mr-2" />}
              {isMicEnabled ? "Mic On" : "Mic Off"}
            </Button>
            
            <Button 
              variant={isScreenSharing ? "default" : "outline"}
              size="sm"
              onClick={toggleScreenShare}
              className={isScreenSharing ? "bg-purple-500 hover:bg-purple-600" : "text-gray-400 hover:text-white"}
            >
              <ScreenShare className="h-4 w-4 mr-2" />
              {isScreenSharing ? "Stop Sharing" : "Share Screen"}
            </Button>
          </div>
          
          <div className="space-y-4">
            {mediaStream.current && (
              <div className="flex items-center space-x-2">
                <Volume2 className="h-5 w-5 text-gray-400" />
                <Slider
                  value={[audioLevel]}
                  max={100}
                  step={1}
                  onValueChange={handleAudioLevelChange}
                  className="flex-1"
                />
                <span className="text-xs text-gray-400 w-8">{audioLevel}%</span>
              </div>
            )}
            
            {isLive ? (
              <Button
                variant="destructive"
                size="lg"
                className="w-full"
                onClick={endLiveStream}
              >
                End Stream
              </Button>
            ) : (
              <Button
                variant="default"
                size="lg"
                className="w-full bg-red-500 hover:bg-red-600"
                onClick={startLiveStream}
                disabled={!mediaStream.current}
              >
                Go Live
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {isLive && (
        <Card className="bg-[#0a0a1f]/80 backdrop-blur-xl border border-[#0077FF]/30 text-white shadow-lg shadow-[#0077FF]/20">
          <CardHeader>
            <CardTitle className="text-white">Share Your Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <StreamShareLink streamId={streamId} streamType={streamType} />
              
              <Button variant="outline" className="text-[#1DA1F2] border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/10">
                <Cast className="h-4 w-4 mr-2" />
                Multicast
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeviceStreamSetup;
