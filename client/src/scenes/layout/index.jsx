import { useState } from 'react';
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useGetUserQuery } from '../../state/api';

const Layout = () => {
    // checking if mobile, if more than 600px return true
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // fetching user data
    const useId = useSelector(state => state.global.userId);
    const { data } = useGetUserQuery(useId);
    


    // Box allows styling this way rather than sx={{ display: "flex" }}
    return <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      <Sidebar
        user={data || {}}
        isNonMobile={isNonMobile}
        drawerWidth="250px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      {/* flexGrow of 1 will make the box take the rest of the space */}
      <Box flexGrow={1}>
        
        <Navbar user={data || {}} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <Outlet />
      </Box>
    </Box>
}

export default Layout