import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Grid, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  LinearProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Define the project structure
interface SavedProject {
  id: number;
  name: string;
  url: string;
  htmlSnippet?: string;
  targetKeywords?: string[];
  date: string;
}

// Define the form data structure
interface AnalysisFormData {
  url: string;
  htmlSnippet?: string;
  targetKeywords?: string[];
}

// Define the props for the component
interface AnalysisFormProps {
  onSubmit: (data: AnalysisFormData) => void;
  isAnalyzing: boolean;
  analysisStage?: string;
  analysisProgress?: number;
}

const AnalysisForm: React.FC<AnalysisFormProps> = ({ 
  onSubmit, 
  isAnalyzing, 
  analysisStage = '', 
  analysisProgress = 0 
}) => {
  // Form state
  const [url, setUrl] = useState('');
  const [htmlSnippet, setHtmlSnippet] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('');
  const [projectName, setProjectName] = useState('');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  
  // Saved projects state
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>(() => {
    const saved = localStorage.getItem('seo-projects');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Dialog state
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  
  // Analysis stages for the progress indicator
  const analysisStages = [
    'Fetching website content',
    'Analyzing Technical SEO',
    'Analyzing Content',
    'Analyzing User Experience',
    'Analyzing Mobile Optimization',
    'Analyzing Competitors',
    'Researching Keywords',
    'Generating Report'
  ];
  
  // Save project to localStorage
  const saveProject = () => {
    const newProject: SavedProject = {
      id: Date.now(),
      name: projectName || `Project ${savedProjects.length + 1}`,
      url,
      htmlSnippet: htmlSnippet || undefined,
      targetKeywords: targetKeywords ? targetKeywords.split(',').map(k => k.trim()).filter(k => k) : undefined,
      date: new Date().toISOString()
    };
    
    const updatedProjects = [...savedProjects, newProject];
    setSavedProjects(updatedProjects);
    localStorage.setItem('seo-projects', JSON.stringify(updatedProjects));
    setSaveDialogOpen(false);
    setProjectName('');
  };
  
  // Load project from saved projects
  const loadProject = (project: SavedProject) => {
    setUrl(project.url);
    setHtmlSnippet(project.htmlSnippet || '');
    setTargetKeywords(project.targetKeywords ? project.targetKeywords.join(', ') : '');
    setLoadDialogOpen(false);
    
    // Auto-expand advanced options if they contain data
    if (project.htmlSnippet || project.targetKeywords?.length) {
      setAdvancedOpen(true);
    }
  };
  
  // Delete saved project
  const deleteProject = (id: number) => {
    const updatedProjects = savedProjects.filter(project => project.id !== id);
    setSavedProjects(updatedProjects);
    localStorage.setItem('seo-projects', JSON.stringify(updatedProjects));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      url,
      htmlSnippet: htmlSnippet || undefined,
      targetKeywords: targetKeywords ? targetKeywords.split(',').map(k => k.trim()).filter(k => k) : undefined
    });
  };
  
  // Get current stage index for progress calculation
  const getCurrentStageIndex = () => {
    if (!analysisStage) return -1;
    return analysisStages.findIndex(stage => 
      stage.toLowerCase().includes(analysisStage.toLowerCase())
    );
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    if (!isAnalyzing) return 0;
    if (analysisProgress > 0) return analysisProgress;
    
    const stageIndex = getCurrentStageIndex();
    if (stageIndex === -1) return 0;
    
    // Calculate progress based on current stage
    return Math.round(((stageIndex + 1) / analysisStages.length) * 100);
  };
  
  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>SEO Analysis</Typography>
      <Divider sx={{ mb: 3 }} />
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Main URL field */}
          <Grid item xs={12}>
            <TextField
              label="Website URL"
              placeholder="https://example.com"
              fullWidth
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isAnalyzing}
              InputProps={{
                endAdornment: (
                  <Tooltip title="Enter the full URL of the website you want to analyze">
                    <InfoOutlinedIcon color="action" sx={{ ml: 1 }} />
                  </Tooltip>
                )
              }}
            />
          </Grid>
          
          {/* Advanced options accordion */}
          <Grid item xs={12}>
            <Accordion 
              expanded={advancedOpen} 
              onChange={() => setAdvancedOpen(!advancedOpen)}
              disabled={isAnalyzing}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Advanced Options</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="HTML Snippet (Optional)"
                      placeholder="Paste HTML code here if you don't want to fetch from URL"
                      fullWidth
                      multiline
                      rows={4}
                      value={htmlSnippet}
                      onChange={(e) => setHtmlSnippet(e.target.value)}
                      disabled={isAnalyzing}
                      InputProps={{
                        endAdornment: (
                          <Tooltip title="Paste HTML directly instead of fetching from URL. Useful for analyzing local or unreachable content.">
                            <InfoOutlinedIcon color="action" sx={{ ml: 1 }} />
                          </Tooltip>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Target Keywords (Optional)"
                      placeholder="keyword1, keyword2, keyword3"
                      fullWidth
                      value={targetKeywords}
                      onChange={(e) => setTargetKeywords(e.target.value)}
                      disabled={isAnalyzing}
                      helperText="Separate keywords with commas"
                      InputProps={{
                        endAdornment: (
                          <Tooltip title="Specify target keywords to focus the analysis on specific terms important to your business">
                            <InfoOutlinedIcon color="action" sx={{ ml: 1 }} />
                          </Tooltip>
                        )
                      }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          
          {/* Action buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<FolderOpenIcon />}
                  onClick={() => setLoadDialogOpen(true)}
                  disabled={isAnalyzing || savedProjects.length === 0}
                  sx={{ mr: 1 }}
                >
                  Load Project
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<SaveIcon />}
                  onClick={() => setSaveDialogOpen(true)}
                  disabled={isAnalyzing || !url}
                >
                  Save Project
                </Button>
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isAnalyzing || !url}
                startIcon={isAnalyzing ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </Button>
            </Box>
          </Grid>
          
          {/* Progress indicator */}
          {isAnalyzing && (
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {analysisStage || 'Analyzing...'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {calculateProgress()}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={calculateProgress()} 
                sx={{ height: 10, borderRadius: 5 }}
              />
              
              {/* Analysis stages */}
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {analysisStages.map((stage, index) => {
                  const stageIndex = getCurrentStageIndex();
                  let status: 'default' | 'primary' | 'success' = 'default';
                  
                  if (index === stageIndex) {
                    status = 'primary';
                  } else if (index < stageIndex) {
                    status = 'success';
                  }
                  
                  return (
                    <Chip 
                      key={index}
                      label={stage}
                      color={status}
                      variant={status === 'default' ? 'outlined' : 'filled'}
                      size="small"
                    />
                  );
                })}
              </Box>
            </Grid>
          )}
        </Grid>
      </form>
      
      {/* Save Project Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            fullWidth
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder={`Project ${savedProjects.length + 1}`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={saveProject} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      
      {/* Load Project Dialog */}
      <Dialog 
        open={loadDialogOpen} 
        onClose={() => setLoadDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Load Saved Project</DialogTitle>
        <DialogContent>
          {savedProjects.length > 0 ? (
            <List>
              {savedProjects.map((project) => (
                <React.Fragment key={project.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" onClick={() => deleteProject(project.id)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={project.name}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {project.url}
                          </Typography>
                          <br />
                          <Typography component="span" variant="caption">
                            {formatDate(project.date)}
                          </Typography>
                          {project.targetKeywords && project.targetKeywords.length > 0 && (
                            <>
                              <br />
                              <Typography component="span" variant="caption">
                                Keywords: {project.targetKeywords.join(', ')}
                              </Typography>
                            </>
                          )}
                        </>
                      }
                    />
                    <Button onClick={() => loadProject(project)}>Load</Button>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              No saved projects found.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoadDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AnalysisForm; 