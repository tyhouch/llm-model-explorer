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
      profileName: 'MacBook Pro (16-inch, M2 Max, 96GB RAM)',
      totalRAM: 96,
      gpuMemory: 38, // Approximate total for M2 Max GPU
      gpuCount: 1,
      isCustom: false,
      supportedFormats: ['GGUF', 'safetensors'],
      supportedQuantizations: ['FP16', 'Q4_K', 'Q5_K', 'Q6_K'],
    },
    {
      profileName: 'MacBook Pro (16-inch, M2 Ultra, 128GB RAM)',
      totalRAM: 128,
      gpuMemory: 76, // Approximate total for M2 Ultra GPU
      gpuCount: 1,
      isCustom: false,
      supportedFormats: ['GGUF', 'safetensors'],
      supportedQuantizations: ['FP16', 'Q4_K', 'Q5_K', 'Q6_K'],
    },
    {
      profileName: 'MacBook Pro (14-inch, M2 Pro, 64GB RAM)',
      totalRAM: 64,
      gpuMemory: 19, // Approximate total for M2 Pro GPU
      gpuCount: 1,
      isCustom: false,
      supportedFormats: ['GGUF', 'safetensors'],
      supportedQuantizations: ['FP16', 'Q4_K', 'Q5_K'],
    },
    {
      profileName: 'MacBook Pro (14-inch, M2 Pro, 36GB RAM)',
      totalRAM: 36,
      gpuMemory: 12, // Approximate for lower M2 Pro configurations
      gpuCount: 1,
      isCustom: false,
      supportedFormats: ['GGUF', 'safetensors'],
      supportedQuantizations: ['FP16', 'Q4_K'],
    },
    {
      profileName: 'MacBook Pro (13-inch, M2, 16GB RAM)',
      totalRAM: 16,
      gpuMemory: 10, // Approximate for M2 GPU
      gpuCount: 1,
      isCustom: false,
      supportedFormats: ['GGUF', 'safetensors'],
      supportedQuantizations: ['FP16', 'Q4_K'],
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
