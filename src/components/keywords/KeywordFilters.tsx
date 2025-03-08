import React, { useState } from 'react';
import {
  Box,
  Drawer,
  Typography,
  Slider,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
} from '@mui/material';

export interface KeywordFilters {
  minVolume: number;
  maxVolume: number;
  minDifficulty: number;
  maxDifficulty: number;
  minCpc: number;
  maxCpc: number;
  hasRanking: boolean;
  hasCompetitors: boolean;
}

interface KeywordFiltersProps {
  open: boolean;
  onClose: () => void;
  filters: KeywordFilters;
  onApplyFilters: (filters: KeywordFilters) => void;
}

const KeywordFilters: React.FC<KeywordFiltersProps> = ({
  open,
  onClose,
  filters,
  onApplyFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<KeywordFilters>(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <Box sx={{ width: 300, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Typography gutterBottom>Search Volume</Typography>
        <Slider
          value={[localFilters.minVolume, localFilters.maxVolume]}
          onChange={(_, newValue: number | number[]) => {
            const [min, max] = newValue as number[];
            setLocalFilters(prev => ({ ...prev, minVolume: min, maxVolume: max }));
          }}
          valueLabelDisplay="auto"
          min={0}
          max={100000}
          step={1000}
        />

        <Typography gutterBottom sx={{ mt: 3 }}>Difficulty</Typography>
        <Slider
          value={[localFilters.minDifficulty, localFilters.maxDifficulty]}
          onChange={(_, newValue: number | number[]) => {
            const [min, max] = newValue as number[];
            setLocalFilters(prev => ({ ...prev, minDifficulty: min, maxDifficulty: max }));
          }}
          valueLabelDisplay="auto"
          min={0}
          max={100}
        />

        <Typography gutterBottom sx={{ mt: 3 }}>CPC ($)</Typography>
        <Slider
          value={[localFilters.minCpc, localFilters.maxCpc]}
          onChange={(_, newValue: number | number[]) => {
            const [min, max] = newValue as number[];
            setLocalFilters(prev => ({ ...prev, minCpc: min, maxCpc: max }));
          }}
          valueLabelDisplay="auto"
          min={0}
          max={50}
          step={0.5}
        />

        <Box sx={{ mt: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={localFilters.hasRanking}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, hasRanking: e.target.checked }))}
              />
            }
            label="Show only ranking keywords"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={localFilters.hasCompetitors}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, hasCompetitors: e.target.checked }))}
              />
            }
            label="Show only competitor keywords"
          />
        </Box>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleApply}
            fullWidth
          >
            Apply
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default KeywordFilters; 