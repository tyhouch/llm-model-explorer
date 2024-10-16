// src/App.tsx

import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from '@/components/SearchBar';
import ModelList from '@/components/ModelList';
import HardwareConfigSidebar from '@/components/HardwareConfigSidebar';
import { ModelInfo, analyzeModelFiles } from '@/types/ModelInfo';
import { HardwareConfig } from '@/types/HardwareConfig';
import CompatibilityExplanationDialog from '@/components/CompatibilityDialog';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hardwareConfig, setHardwareConfig] = useState<HardwareConfig>({
    profileName: "Custom",
    isCustom: true,
    totalRAM: 16,
    gpuMemory: 4,
    gpuCount: 1,
    supportedFormats: ['All'],
    supportedQuantizations: ['All'],
  });
  const [filterCompatible, setFilterCompatible] = useState(false);
  const [isExplanationDialogOpen, setIsExplanationDialogOpen] = useState(false);

  const fetchModelDetails = async (modelId: string): Promise<ModelInfo> => {
    try {
      const response = await axios.get(`https://huggingface.co/api/models/${modelId}?blobs=true`);
      const modelData = response.data;
      const { totalSize, quantizations, formats, modelParameters } = analyzeModelFiles(modelData.siblings);
      return {
        ...modelData,
        totalSize,
        quantizations,
        formats,
        modelParameters,
      };
    } catch (error) {
      console.error(`Error fetching details for model ${modelId}:`, error);
      throw error;
    }
  };

  const searchModels = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`https://huggingface.co/api/models`, {
        params: { 
          search: searchTerm,
          full: true
        }
      });
      
      const modelsWithDetails = await Promise.all(
        response.data.map((model: ModelInfo) => fetchModelDetails(model.id))
      );

      setModels(modelsWithDetails);
    } catch (err) {
      setError('Failed to fetch models. Please try again.');
      console.error(err);
    }
    setLoading(false);
  };

  const isModelCompatible = (model: ModelInfo, hardwareConfig: HardwareConfig): boolean => {
    // 1. Format Compatibility Check
    const supportedFormats = hardwareConfig.supportedFormats;
    const supportedQuantizations = hardwareConfig.supportedQuantizations;
  
    const isFormatCompatible = model.formats.some(format => 
      supportedFormats.includes(format) || supportedFormats.includes('All')
    );
  
    if (!isFormatCompatible) {
      return false;
    }
  
    // 2. Quantization Compatibility Check
    // Handle models with empty quantizations (assumed to be FP32)
    const modelQuantizations = model.quantizations.length > 0 ? model.quantizations : ['FP32'];
  
    const isQuantizationCompatible = modelQuantizations.some(quant => 
      supportedQuantizations.includes(quant) || supportedQuantizations.includes('All')
    );
  
    if (!isQuantizationCompatible) {
      return false;
    }
  
    // 3. Memory Estimation
    // Default bytes per parameter based on quantization
    let bytesPerParam = 4; // Default to FP32
    if (modelQuantizations.includes('FP16')) {
      bytesPerParam = 2;
    } else if (modelQuantizations.some(q => ['INT8', 'Q8'].includes(q))) {
      bytesPerParam = 1;
    } else if (modelQuantizations.some(q => ['Q4', 'Q4_K', 'Q5', 'Q5_K', 'Q6_K', 'Q2_K', 'Q3_K'].includes(q))) {
      bytesPerParam = 0.5;
    }
  
    // Estimate model parameters if not available
    let numParams = model.modelParameters;
    if (!numParams) {
      // If modelParameters not extracted, estimate based on totalSize and bytesPerParam
      numParams = model.totalSize / bytesPerParam;
    }
  
    // Estimate model memory
    const modelMemory = numParams * bytesPerParam;
  
    // Estimate activation memory (simplified)
    const activationMultiplier = 1.5; // Adjust based on model type
    const totalRequiredMemory = modelMemory * activationMultiplier;
  
    // 4. Check against available memory
    const gpuMemoryPerGpuBytes = hardwareConfig.gpuMemory * 1024 * 1024 * 1024;
    const totalGpuMemoryBytes = gpuMemoryPerGpuBytes * hardwareConfig.gpuCount;
    const totalSystemMemoryBytes = hardwareConfig.totalRAM * 1024 * 1024 * 1024;
  
    // Reserve some memory for system and other applications (e.g., 20%)
    const reservedSystemMemory = totalSystemMemoryBytes * 0.2;
    const availableSystemMemory = totalSystemMemoryBytes - reservedSystemMemory;
  
    const totalAvailableMemoryBytes = totalGpuMemoryBytes + availableSystemMemory;
  
    if (totalRequiredMemory <= totalAvailableMemoryBytes) {
      return true;
    }
  
    return false;
  };
  

  const filteredModels = filterCompatible
    ? models.filter(model => isModelCompatible(model, hardwareConfig))
    : models;

  return (
    <div className="flex h-screen overflow-hidden">
      <HardwareConfigSidebar
        config={hardwareConfig}
        setConfig={setHardwareConfig}
        filterCompatible={filterCompatible}
        setFilterCompatible={setFilterCompatible}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-4">Model Explorer</h1>
          <div className="flex items-center mb-4">
            <SearchBar 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              searchModels={searchModels} 
              loading={loading} 
            />
            <button
              className="ml-4 text-blue-500 hover:text-blue-700"
              onClick={() => setIsExplanationDialogOpen(true)}
            >
              ℹ️ How is compatibility calculated?
            </button>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <ModelList 
            models={filteredModels} 
            isModelCompatible={(model) => isModelCompatible(model, hardwareConfig)}
          />
        </div>
      </div>
      <CompatibilityExplanationDialog
        isOpen={isExplanationDialogOpen}
        onClose={() => setIsExplanationDialogOpen(false)}
      />
    </div>
  );
};

export default App;
