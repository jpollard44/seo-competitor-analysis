import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
} from '@mui/material';

interface APIConfig {
  ahrefsApiKey: string;
  semrushApiKey: string;
  googleSearchConsoleEmail: string;
}

interface UserPreferences {
  darkMode: boolean;
  emailNotifications: boolean;
  autoRefreshData: boolean;
  dataUpdateInterval: number;
}

const Settings: React.FC = () => {
  const [apiConfig, setApiConfig] = useState<APIConfig>({
    ahrefsApiKey: '',
    semrushApiKey: '',
    googleSearchConsoleEmail: '',
  });

  const [preferences, setPreferences] = useState<UserPreferences>({
    darkMode: false,
    emailNotifications: true,
    autoRefreshData: false,
    dataUpdateInterval: 24,
  });

  const [saveStatus, setSaveStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSaveSettings = async () => {
    try {
      // TODO: API call to save settings
      setSaveStatus({ success: true, message: 'Settings saved successfully!' });
    } catch (error) {
      setSaveStatus({ success: false, message: 'Failed to save settings. Please try again.' });
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Settings</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>API Configuration</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Ahrefs API Key"
                  type="password"
                  value={apiConfig.ahrefsApiKey}
                  onChange={(e) => setApiConfig({ ...apiConfig, ahrefsApiKey: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="SEMrush API Key"
                  type="password"
                  value={apiConfig.semrushApiKey}
                  onChange={(e) => setApiConfig({ ...apiConfig, semrushApiKey: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Google Search Console Email"
                  value={apiConfig.googleSearchConsoleEmail}
                  onChange={(e) => setApiConfig({ ...apiConfig, googleSearchConsoleEmail: e.target.value })}
                  fullWidth
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>User Preferences</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.darkMode}
                      onChange={(e) => setPreferences({ ...preferences, darkMode: e.target.checked })}
                    />
                  }
                  label="Dark Mode"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.emailNotifications}
                      onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.autoRefreshData}
                      onChange={(e) => setPreferences({ ...preferences, autoRefreshData: e.target.checked })}
                    />
                  }
                  label="Auto Refresh Data"
                />
                <TextField
                  label="Data Update Interval (hours)"
                  type="number"
                  value={preferences.dataUpdateInterval}
                  onChange={(e) => setPreferences({ ...preferences, dataUpdateInterval: Number(e.target.value) })}
                  disabled={!preferences.autoRefreshData}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          {saveStatus && (
            <Alert severity={saveStatus.success ? 'success' : 'error'} sx={{ mb: 2 }}>
              {saveStatus.message}
            </Alert>
          )}
          <Button variant="contained" onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings; 