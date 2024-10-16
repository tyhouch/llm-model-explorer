//src/components/SearchBar.tsx

import React from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchModels: () => void;
  loading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, searchModels, loading }) => (
  <div className="flex gap-2 mb-4">
    <Input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search for models..."
      className="flex-grow"
    />
    <Button onClick={searchModels} disabled={loading}>
      {loading ? 'Searching...' : 'Search'}
    </Button>
  </div>
);

export default SearchBar;
