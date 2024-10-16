// src/components/HardwareConfigSidebar.tsx

import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { HardwareConfig, hardwareProfiles } from '@/types/HardwareConfig';

interface HardwareConfigSidebarProps {
  config: HardwareConfig;
  setConfig: React.Dispatch<React.SetStateAction<HardwareConfig>>;
  filterCompatible: boolean;
  setFilterCompatible: React.Dispatch<React.SetStateAction<boolean>>;
}

const HardwareConfigSidebar: React.FC<HardwareConfigSidebarProps> = ({
  config,
  setConfig,
  filterCompatible,
  setFilterCompatible
}) => {
  const handleProfileChange = (profileName: string) => {
    const selectedProfile = hardwareProfiles.find(profile => profile.profileName === profileName);
    if (selectedProfile) {
      setConfig(selectedProfile);
    }
  };

  const handleCustomChange = (field: keyof HardwareConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value,
      profileName: 'Custom',
      isCustom: true,
    }));
  };

  const formatOptions = ['GGUF', 'safetensors', 'pytorch', 'onnx']; // Add more as needed
  const quantizationOptions = ['FP16', 'FP32', 'Q4_K', 'Q5_K', 'Q8_0']; // Add more as needed

  const handleAddFormat = (format: string) => {
    if (!config.supportedFormats.includes(format)) {
      handleCustomChange('supportedFormats', [...config.supportedFormats, format]);
    }
  };

  const handleRemoveFormat = (format: string) => {
    handleCustomChange('supportedFormats', config.supportedFormats.filter(f => f !== format));
  };

  const handleAddQuantization = (quant: string) => {
    if (!config.supportedQuantizations.includes(quant)) {
      handleCustomChange('supportedQuantizations', [...config.supportedQuantizations, quant]);
    }
  };

  const handleRemoveQuantization = (quant: string) => {
    handleCustomChange('supportedQuantizations', config.supportedQuantizations.filter(q => q !== quant));
  };

  return (
    <div className="w-80 p-4 bg-gray-100 h-screen overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Hardware Configuration</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="hardwareProfile">Select Hardware Profile</Label>
          <Select
            value={config.profileName}
            onValueChange={handleProfileChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a hardware profile" />
            </SelectTrigger>
            <SelectContent>
              {hardwareProfiles.map(profile => (
                <SelectItem key={profile.profileName} value={profile.profileName}>
                  {profile.profileName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {config.isCustom && (
          <>
            <div>
              <Label htmlFor="totalRAM">Total System RAM (GB)</Label>
              <Input
                id="totalRAM"
                type="number"
                value={config.totalRAM}
                onChange={(e) => handleCustomChange('totalRAM', Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="gpuMemory">GPU Memory per GPU (GB)</Label>
              <Input
                id="gpuMemory"
                type="number"
                value={config.gpuMemory}
                onChange={(e) => handleCustomChange('gpuMemory', Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="gpuCount">Number of GPUs</Label>
              <Input
                id="gpuCount"
                type="number"
                value={config.gpuCount}
                onChange={(e) => handleCustomChange('gpuCount', Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Supported Formats</Label>
              <Select onValueChange={handleAddFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Add format" />
                </SelectTrigger>
                <SelectContent>
                  {formatOptions.map(format => (
                    <SelectItem key={format} value={format}>{format}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 flex flex-wrap gap-2">
                {config.supportedFormats.map(format => (
                  <Button
                    key={format}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRemoveFormat(format)}
                  >
                    {format} ×
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label>Supported Quantizations</Label>
              <Select onValueChange={handleAddQuantization}>
                <SelectTrigger>
                  <SelectValue placeholder="Add quantization" />
                </SelectTrigger>
                <SelectContent>
                  {quantizationOptions.map(quant => (
                    <SelectItem key={quant} value={quant}>{quant}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 flex flex-wrap gap-2">
                {config.supportedQuantizations.map(quant => (
                  <Button
                    key={quant}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRemoveQuantization(quant)}
                  >
                    {quant} ×
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex items-center space-x-2">
          <Switch
            id="filterCompatible"
            checked={filterCompatible}
            onCheckedChange={setFilterCompatible}
          />
          <Label htmlFor="filterCompatible">Filter Compatible Models</Label>
        </div>
      </div>
    </div>
  );
};

export default HardwareConfigSidebar;
