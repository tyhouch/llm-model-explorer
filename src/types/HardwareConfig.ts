// src/types/HardwareConfig.ts

export interface HardwareConfig {
    profileName: string;
    totalRAM: number; // in GB
    gpuMemory: number; // per GPU in GB
    gpuCount: number;
    isCustom: boolean;
    supportedFormats: string[];
    supportedQuantizations: string[];
  }
  
  export const hardwareProfiles: HardwareConfig[] = [
    {
      profileName: 'MacBook Pro (13-inch, M1, 8GB RAM)',
      totalRAM: 8,
      gpuMemory: 1,
      gpuCount: 1,
      isCustom: false,
      supportedFormats: ['GGUF', 'safetensors'],
      supportedQuantizations: ['FP16', 'Q4_K', 'Q5_K', 'Q6_K'],
    },
    {
      profileName: 'MacBook Pro (16-inch, Intel, 16GB RAM)',
      totalRAM: 16,
      gpuMemory: 4,
      gpuCount: 1,
      isCustom: false,
      supportedFormats: ['GGUF', 'safetensors'],
      supportedQuantizations: ['FP16'],
    },
    {
      profileName: 'AWS EC2 g4dn.xlarge',
      totalRAM: 16,
      gpuMemory: 16,
      gpuCount: 1,
      isCustom: false,
      supportedFormats: ['All'],
      supportedQuantizations: ['All'],
    },
    {
      profileName: 'Single Server with NVIDIA A100 (40GB)',
      totalRAM: 256,
      gpuMemory: 40,
      gpuCount: 1,
      isCustom: false,
      supportedFormats: ['All'],
      supportedQuantizations: ['All'],
    },
    {
      profileName: 'Multi-node Cluster with NVIDIA V100 (16GB) GPUs',
      totalRAM: 512,
      gpuMemory: 16,
      gpuCount: 8,
      isCustom: false,
      supportedFormats: ['All'],
      supportedQuantizations: ['All'],
    },
    {
      profileName: 'Custom',
      totalRAM: 16,
      gpuMemory: 4,
      gpuCount: 1,
      isCustom: true,
      supportedFormats: ['All'],
      supportedQuantizations: ['All'],
    },
  ];
  