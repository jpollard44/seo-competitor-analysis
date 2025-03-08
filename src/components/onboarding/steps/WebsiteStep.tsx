import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  FormHelperText
} from '@mui/material';

interface WebsiteStepProps {
  formData: {
    website: string;
    industry: string;
  };
  onChange: (data: Partial<WebsiteStepProps['formData']>) => void;
  errors: {
    website?: string;
    industry?: string;
  };
}

const industries = [
  'E-commerce',
  'Technology',
  'Healthcare',
  'Education',
  'Finance',
  'Travel',
  'Other'
];

const WebsiteStep: React.FC<WebsiteStepProps> = ({ formData, onChange, errors }) => {
  const validateUrl = (url: string) => {
    try {
      new URL(url);
      onChange({ website: url });
    } catch {
      onChange({ website: url }); // Still update the value but validation will fail
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h6" gutterBottom>
        Tell us about your website
      </Typography>
      <Box sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="Website URL"
          value={formData.website}
          onChange={(e) => validateUrl(e.target.value)}
          placeholder="https://example.com"
          error={!!errors.website}
          helperText={errors.website}
          sx={{ mb: 3 }}
        />
        <FormControl fullWidth error={!!errors.industry}>
          <InputLabel>Industry</InputLabel>
          <Select
            value={formData.industry}
            label="Industry"
            onChange={(e) => onChange({ industry: e.target.value })}
          >
            {industries.map((industry) => (
              <MenuItem key={industry} value={industry}>
                {industry}
              </MenuItem>
            ))}
          </Select>
          {errors.industry && <FormHelperText>{errors.industry}</FormHelperText>}
        </FormControl>
      </Box>
    </Box>
  );
};

export default WebsiteStep; 