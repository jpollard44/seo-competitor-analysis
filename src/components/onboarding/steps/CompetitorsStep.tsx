import React, { useState } from 'react';
import {
  Box,
  TextField,
  Chip,
  Typography,
  Button
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface CompetitorsStepProps {
  formData: {
    competitors: string[];
  };
  onChange: (data: { competitors: string[] }) => void;
  error?: string;
}

const CompetitorsStep: React.FC<CompetitorsStepProps> = ({ formData, onChange, error }) => {
  const [competitor, setCompetitor] = useState('');

  const handleAdd = () => {
    if (competitor && !formData.competitors.includes(competitor)) {
      onChange({ competitors: [...formData.competitors, competitor] });
      setCompetitor('');
    }
  };

  const handleDelete = (competitorToDelete: string) => {
    onChange({
      competitors: formData.competitors.filter((c) => c !== competitorToDelete)
    });
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add your main competitors
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <TextField
          fullWidth
          label="Competitor URL"
          value={competitor}
          onChange={(e) => setCompetitor(e.target.value)}
          placeholder="https://competitor.com"
          error={!!error && formData.competitors.length === 0}
          helperText={formData.competitors.length === 0 ? error : ''}
        />
        <Button
          variant="contained"
          onClick={handleAdd}
          startIcon={<AddIcon />}
        >
          Add
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {formData.competitors.map((comp) => (
          <Chip
            key={comp}
            label={comp}
            onDelete={() => handleDelete(comp)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CompetitorsStep; 