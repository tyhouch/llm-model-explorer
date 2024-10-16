// src/components/ModelCard.tsx

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ModelInfo, ModelFile } from '../types/ModelInfo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ModelCardProps {
  model: ModelInfo;
  isCompatible: boolean;
}

const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

const formatParameterCount = (params: number): string => {
  if (params >= 1e9) return `${(params / 1e9).toFixed(2)}B`;
  if (params >= 1e6) return `${(params / 1e6).toFixed(2)}M`;
  if (params >= 1e3) return `${(params / 1e3).toFixed(2)}K`;
  return `${params}`;
};

const ModelCard: React.FC<ModelCardProps> = ({ model, isCompatible }) => (
  <Card key={model.id}>
    <CardHeader>
      <CardTitle>{model.id}</CardTitle>
      <CardDescription>{model.author || 'Unknown author'}</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Downloads: {model.downloads}</p>
      <p>Pipeline: {model.pipeline_tag || 'N/A'}</p>
      <p>Last modified: {model.lastModified || 'N/A'}</p>
      <p>Total Size: {formatFileSize(model.totalSize)}</p>
      {model.modelParameters > 0 && (
        <p>Parameters: {formatParameterCount(model.modelParameters)}</p>
      )}
      <p className={isCompatible ? "text-green-600" : "text-red-600"}>
        {isCompatible ? "Compatible with your hardware" : "Not compatible with your hardware"}
      </p>
      <div className="mt-2">
        <h4 className="font-semibold">Formats:</h4>
        {model.formats.map((format) => (
          <span key={format} className="inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-blue-700 mr-2 mb-2">
            {format}
          </span>
        ))}
      </div>
      <div className="mt-2">
        <h4 className="font-semibold">Quantizations:</h4>
        {model.quantizations.map((quant) => (
          <span key={quant} className="inline-block bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-700 mr-2 mb-2">
            {quant}
          </span>
        ))}
      </div>
      <Accordion type="single" collapsible className="mt-2">
        <AccordionItem value="tags">
          <AccordionTrigger>Tags</AccordionTrigger>
          <AccordionContent>
            {model.tags.map((tag: string) => (
              <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                {tag}
              </span>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="files">
          <AccordionTrigger>Files</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc list-inside">
              {model.siblings.map((file: ModelFile) => (
                <li key={file.rfilename}>
                  {file.rfilename} - {formatFileSize(file.size)}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CardContent>
  </Card>
);

export default ModelCard;
