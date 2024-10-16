// src/components/HardwareProfileSelector.tsx

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface HardwareConfig {
  totalRAM: number;
  gpuMemory: number;
  gpuCount: number;
}

interface HardwareProfile {
  name: string;
  specs: HardwareConfig;
}

interface HardwareProfileSelectorProps {
  setConfig: React.Dispatch<React.SetStateAction<HardwareConfig>>;
}

const hardwareProfiles: HardwareProfile[] = [
  {
    name: 'MacBook Pro (13-inch, M1, 8GB RAM)',
    specs: {
      totalRAM: 8,
      gpuMemory: 1, // Approximate shared memory for M1 GPU
      gpuCount: 1,
    },
  },
  {
    name: 'MacBook Pro (16-inch, Intel, 16GB RAM)',
    specs: {
      totalRAM: 16,
      gpuMemory: 4, // Approximate for integrated graphics
      gpuCount: 1,
    },
  },
  {
    name: 'AWS EC2 g4dn.xlarge',
    specs: {
      totalRAM: 16,
      gpuMemory: 16, // NVIDIA T4 GPU with 16GB
      gpuCount: 1,
    },
  },
  {
    name: 'Single Server with NVIDIA A100 (40GB)',
    specs: {
      totalRAM: 256,
      gpuMemory: 40,
      gpuCount: 1,
    },
  },
  {
    name: 'Multi-node Cluster with NVIDIA V100 (16GB) GPUs',
    specs: {
      totalRAM: 512,
      gpuMemory: 16,
      gpuCount: 8,
    },
  },
  // Add more profiles as needed
];

const HardwareProfileSelector: React.FC<HardwareProfileSelectorProps> = ({ setConfig }) => {
  return (
    <div>
      <Label htmlFor="hardwareProfile">Select Hardware Profile</Label>
      <Select
        onValueChange={(value) => {
          const selectedProfile = hardwareProfiles.find(profile => profile.name === value);
          if (selectedProfile) {
            setConfig(selectedProfile.specs);
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a hardware profile" />
        </SelectTrigger>
        <SelectContent>
          {hardwareProfiles.map(profile => (
            <SelectItem key={profile.name} value={profile.name}>
              {profile.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default HardwareProfileSelector;
