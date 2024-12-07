import { FC, useContext, useEffect } from "react";
import {styled} from "styled-components";
import { NavLink } from "react-router-dom";
import MenuOffIcon from "../assets/icons/menu-off.svg";
import { Context } from "../context";
import { useOutSideClick } from "../hooks/useOutSideClick";
import { animated, useSpring } from "@react-spring/web";

const SideBarWrapper = styled(animated.aside)`
  position: absolute;
  left: -200px;
  top: 0;
  > ul {
    background-color: #42424e;
    transition: all 0.3s;
    width: 200px;
    height: 100vh;

    z-index: 2;

    &.open-sidebar {
      left: 0;
    }

    > li {
      line-height: 44px;
      height: 44px;
      cursor: pointer;

      &:hover {
        background-color: #343442;
      }

      &.close-button-wrapper {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-right: 20px;
        cursor: pointer;

        &:hover {
          background-color: #42424e;
        }

        > h3 {
          font-size: 18px;
        }

        > svg {
          width: 1.5em;
          height: 1.5em;
          cursor: pointer;
          -webkit-app-region: no-drag;
        }
      }

      > a {
        display: block;
        width: 100%;
        padding-left: 32px;

        &.selected {
          background-color: #2c2a38;
        }
      }
    }
  }

  > .shadow {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    top: 25px;
    z-index: 1;
    background-color: rgba(42, 42, 56, 0.8);
  }
`;
const SideBar: FC = () => {
  const [springs, api] = useSpring(() => ({
    from: { x: 0 },
    config:{
      duration: 300
    }
  }));
  const { isSidebarVisible, setIsSidebarVisible } = useContext(Context);
  const ref = useOutSideClick(() => {
    isSidebarVisible && setIsSidebarVisible(false);
  });

  useEffect(() => {
    api.start({
      from: { x: isSidebarVisible ? 0 : 200 },
      to: { x: isSidebarVisible ? 200 : 0 },
    });
  }, [isSidebarVisible]);

  return (
    <SideBarWrapper ref={ref} style={springs}>
      <ul>
        <li
          className="close-button-wrapper"
          onClick={() => {
            setIsSidebarVisible(false);
          }}
        >
          <MenuOffIcon/>
        </li>
        <li>
          <NavLink
            to="/upload"
            className={({ isActive }) => (isActive ? "selected" : "")}
            onClick={() => {
              setIsSidebarVisible(false);
            }}
          >
            {" "}
            上传
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/history"
            className={({ isActive }) => (isActive ? "selected" : "")}
            onClick={() => {
              setIsSidebarVisible(false);
            }}
          >
            {" "}
            历史记录
          </NavLink>
        </li>
      </ul>
    </SideBarWrapper>
  );
};

export default SideBar;
