import React from "react";
import { Link as RouterLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Config from "../config";

function TopBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "transparent",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <IconButton
            id="menu-button"
            size="small"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2 }}
            aria-controls={open ? "main-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Menu
        id="main-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "menu-button",
        }}
      >
        <MenuItem component={RouterLink} to="/about" onClick={handleClose}>
          About
        </MenuItem>
        <MenuItem
          component={Link}
          href={`${Config.etherScanUrl}/address/${Config.swapFrenContract}`}
          onClick={handleClose}
          target="_blank"
          rel="noopener noreferrer"
        >
          Etherscan
          <LogoutIcon sx={{ ml: 1 }} fontSize="small" />
        </MenuItem>
        <MenuItem
          component={Link}
          href="https://github.com/dssllc/swapfren"
          onClick={handleClose}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Repo <LogoutIcon sx={{ ml: 1 }} fontSize="small" />
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default TopBar;
