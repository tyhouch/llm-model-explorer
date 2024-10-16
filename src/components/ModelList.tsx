import React from 'react';
import { ModelInfo } from '@/types/ModelInfo';
import ModelCard from './ModelCard';

interface ModelListProps {
  models: ModelInfo[];
  isModelCompatible: (model: ModelInfo) => boolean;
}

const ModelList: React.FC<ModelListProps> = ({ models, isModelCompatible }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {models.map((model) => (
        <ModelCard key={model.id} model={model} isCompatible={isModelCompatible(model)} />
      ))}
    </div>
  );
};

export default ModelList;