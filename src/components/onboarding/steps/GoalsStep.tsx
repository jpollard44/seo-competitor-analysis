import React from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material';

interface GoalsStepProps {
  formData: {
    goals: string[];
  };
  onChange: (data: { goals: string[] }) => void;
}

const goals = [
  'Improve search rankings',
  'Increase organic traffic',
  'Generate more leads',
  'Boost conversion rate',
  'Outrank competitors',
  'Content optimization'
];

const GoalsStep: React.FC<GoalsStepProps> = ({ formData, onChange }) => {
  const handleToggle = (goal: string) => {
    const newGoals = formData.goals.includes(goal)
      ? formData.goals.filter((g) => g !== goal)
      : [...formData.goals, goal];
    onChange({ goals: newGoals });
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h6" gutterBottom>
        What are your SEO goals?
      </Typography>
      <Typography color="textSecondary" sx={{ mb: 3 }}>
        Select all that apply
      </Typography>
      <FormGroup>
        {goals.map((goal) => (
          <FormControlLabel
            key={goal}
            control={
              <Checkbox
                checked={formData.goals.includes(goal)}
                onChange={() => handleToggle(goal)}
              />
            }
            label={goal}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default GoalsStep; 