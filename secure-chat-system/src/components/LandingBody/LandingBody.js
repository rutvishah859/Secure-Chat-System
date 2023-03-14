import React, { useState } from "react";
import "./LandingBody.css";
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import SigninBody from "../SigninBody/SigninBody";
import SignupBody from "../SignupBody/SignupBody";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const LandingBody = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return(
        <Box id="landing-body">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} variant="fullWidth" aria-label="Login Signup Form">
                <Tab label="Sign In" {...a11yProps(0)} />
                <Tab label="Sign Up" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <h2 class="app-title">Chatr</h2>
                <h3 class="form-label">Sign In</h3>
                <SigninBody />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <h2 class="app-title">Chatr</h2>
                <h3 class="form-label">Sign Up</h3>
                <SignupBody />
            </TabPanel>
        </Box>
    );
};

export default LandingBody;