import {FC, PropsWithChildren} from "react";
import styled from "styled-components";

import SideBar from "./SideBar";


const AppWrapper = styled.div`
  
  min-height: calc(100vh - 28.5px);
  display: flex;
  flex-direction: column;

`
const Layout: FC<PropsWithChildren> = ({children}) => {

    return (
        <AppWrapper>
            <SideBar/>
            {children}
        </AppWrapper>
    )

}

export default Layout;