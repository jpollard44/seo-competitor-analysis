import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  Fade
} from '@mui/material';
import WelcomeStep from './steps/WelcomeStep';
import WebsiteStep from './steps/WebsiteStep';
import CompetitorsStep from './steps/CompetitorsStep';
import GoalsStep from './steps/GoalsStep';

const steps = ['Welcome', 'Your Website', 'Competitors', 'Goals'];

interface QuickStartWizardProps {
  open: boolean;
  onClose: () => void;
}

interface FormErrors {
  website?: string;
  industry?: string;
  competitors?: string;
}

const QuickStartWizard: React.FC<QuickStartWizardProps> = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('wizardFormData');
    return savedData ? JSON.parse(savedData) : {
      website: '',
      industry: '',
      competitors: [],
      goals: []
    };
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    // Save form data to localStorage whenever it changes
    localStorage.setItem('wizardFormData', JSON.stringify(formData));
  }, [formData]);

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 1: // Website step
        if (!formData.website) {
          newErrors.website = 'Website URL is required';
        } else {
          try {
            new URL(formData.website);
          } catch {
            newErrors.website = 'Please enter a valid URL';
          }
        }
        if (!formData.industry) {
          newErrors.industry = 'Please select an industry';
        }
        break;
      case 2: // Competitors step
        if (formData.competitors.length === 0) {
          newErrors.competitors = 'Please add at least one competitor';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0 || validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setErrors({});
  };

  const handleFinish = () => {
    if (validateStep(activeStep)) {
      // Save final data
      localStorage.setItem('onboardingComplete', 'true');
      localStorage.setItem('seoToolConfig', JSON.stringify(formData));
      onClose();
    }
  };

  const renderStepContent = (step: number) => {
    const StepComponent = (() => {
      switch (step) {
        case 0:
          return <WelcomeStep />;
        case 1:
          return (
            <WebsiteStep
              formData={formData}
              onChange={(data) => setFormData({ ...formData, ...data })}
              errors={errors}
            />
          );
        case 2:
          return (
            <CompetitorsStep
              formData={formData}
              onChange={(data) => setFormData({ ...formData, ...data })}
              error={errors.competitors}
            />
          );
        case 3:
          return (
            <GoalsStep
              formData={formData}
              onChange={(data) => setFormData({ ...formData, ...data })}
            />
          );
        default:
          return null;
      }
    })();

    return (
      <Fade in={true} timeout={300}>
        <Box>{StepComponent}</Box>
      </Fade>
    );
  };

  return (
    <Dialog 
      open={open} 
      maxWidth="md" 
      fullWidth
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 400 }}
    >
      <DialogTitle>Quick Start Setup</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        {renderStepContent(activeStep)}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Skip
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {activeStep > 0 && (
          <Button onClick={handleBack}>
            Back
          </Button>
        )}
        {activeStep === steps.length - 1 ? (
          <Button onClick={handleFinish} variant="contained">
            Finish
          </Button>
        ) : (
          <Button onClick={handleNext} variant="contained">
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default QuickStartWizard; 