import {FC, useContext, useEffect, useState}from "react";
import MenuOnIcon from "../assets/icons/menu-on.svg";
import CloseIcon from "../assets/icons/close.svg";
import MaxIcon from "../assets/icons/max.svg";
import MinusIcon from "../assets/icons/minus.svg";
import FixIcon from "../assets/icons/fixed.svg";
import RestoreIcon from '../assets/icons/restore.svg'
import {Context} from "../context";
import {styled} from "styled-components";



const NavWrapper = styled.nav`
  max-height: 30px;
  -webkit-app-region: drag;
  background-color: #343442;

  > ul {
    width: 100%;
    text-align: right;

    > li {
      display: inline-block;
      padding: 4px 6px;
      cursor: pointer;
      -webkit-app-region: no-drag;

      &:first-child {
        float: left;
      }

      &:last-child:hover {
        background: #fb7373;
      }

      &:hover {
        background-color: hsla(0, 0%, 98%, .2);

      }
    }


  }
`

const Nav: FC = () => {
    const [isMaxWindow, setIsMaxWindow] = useState(false)
    const [isFixedWindow, setIsFixedWindow] = useState(false)
    const {setIsSidebarVisible} = useContext(Context)

    useEffect(()=>{
         window.electron.onResponse('isMaxWindow',(_:any,isMaxWindow:boolean)=>{
             setIsMaxWindow(isMaxWindow)
         })
    },[])
    return <NavWrapper>
        <ul>
            <li onClick={() => {
                setIsSidebarVisible(true)
            }
            }>
                <MenuOnIcon/>
            </li>
            <li onClick={() => {
                window.electron.fixedWindow(!isFixedWindow)
                setIsFixedWindow(!isFixedWindow)
            }
            } style={isFixedWindow ? {background: 'hsla(0,0%,98%,.2)'} : {}}>
                <FixIcon/>
            </li>
            <li onClick={() => {
                window.electron.minimizeWindow()
            }
            }>
                <MinusIcon/>
            </li>
            {isMaxWindow ? <li onClick={() => {
                    window.electron.resizeWindow()
                    setIsMaxWindow(false)
                }}
                >
                   <RestoreIcon/>
                </li> :
                <li onClick={() => {
                    window.electron.maximizeWindow()
                    setIsMaxWindow(true)
                }
                }>
                    <MaxIcon/>
                </li>}
            <li onClick={() => {
                window.electron.closeWindow()
            }
            }>
                <CloseIcon/>
            </li>
        </ul>
    </NavWrapper>
}

export default Nav;