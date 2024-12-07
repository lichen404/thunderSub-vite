import React, {useContext, useState} from 'react';
import {styled} from "styled-components";
import UploadIcon from '../assets/icons/upload-video.svg';
import LoadingIcon from '../assets/icons/loading.svg';
import {useNavigate} from "react-router-dom";
import {Context} from "../context";
import type { Sub } from '../types/sub';


const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`
const UploadWrapper = styled.div`
  min-width: 256px;
  height: 256px;
  width: 60%;
  border: 4px dashed #42424e;

  > label {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    input {
      display: none;
    }

    > span {
      margin-top: 8px;
    }
  }
`
const Shadow = styled.div`
  width: 100%;
  height: calc(100vh - 28.5px);
  background-color: #2c2a38;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 2;
`

const SideBarShadow = styled.div`
  width: 200px;
  height: calc(100vh - 28.5px);
`


const Upload: React.FC = () => {
    const navigate = useNavigate()
    const {setFileList, isSidebarVisible} = useContext(Context)
    const [isLoading, setIsLoading] = useState(false)


    const handleUpload = async (e: any) => {
        e.preventDefault()
        const payload = {
            videoName: e.dataTransfer?.files[0].name || e.target.files[0].name,
            videoPath: e.dataTransfer?.files[0].path || e.target.files[0].path
        }
        setIsLoading(true)

        const res = await window.electron.invokeUploadFile(payload).catch(e => {
            console.log(e)
            setIsLoading(false)
        })
        if (res) {
            setIsLoading(false)
            e.target.value = null
            setFileList(res.data.filter(((sub: Sub) => sub.url)))
            navigate(`/${payload.videoName}/list`)
        }

    }
    return (

        <Wrapper>
            {isLoading && <Shadow><LoadingIcon className="loading-icon"/></Shadow>}
            {isSidebarVisible && <SideBarShadow/>}
            <UploadWrapper>
                <label onDrop={handleUpload} onDragOver={
                    (e) => {
                        e.preventDefault();
                    }
                }><UploadIcon name="upload-video" className="upload-video-icon"/>
                    <span>将视频文件拖拽至此，或点击选择</span>
                    <input type="file" onChange={
                        handleUpload
                    }/>
                </label>
            </UploadWrapper>
        </Wrapper>


    )
}
export default Upload;