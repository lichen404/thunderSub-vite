import React, {FC, useContext} from "react";
import {Context} from "../context";
import SubTable from "../components/Table";

import {styled} from "styled-components";

import ViewButton from "../components/ViewButton";

const Wrapper = styled.div`
  max-height:calc(100vh - 28.5px);
  overflow-y: auto;
  button {
    cursor: pointer;
    background-color: #2c2a38;
    > svg {
      width: 24px;
      height: 24px;
    }
  }
`

const List: FC = () => {

    const {fileList} = useContext(Context)
    return (

        <Wrapper>
            <SubTable columns={
                [
                    {
                        dataIndex: "name",
                        name: "名称",

                    },
                    {
                        dataIndex: "languages",
                        name: "语言",
                        width: 180,
                        render(languages) {
                            return languages.join(",")
                        }
                    },
                    {
                        dataIndex: "ext",
                        name: "类型",
                        width: 100
                    },
                    {
                        dataIndex: 'url',
                        width: 80,
                        render(url, file) {
                            return <ViewButton url={url} file={file}/>
                        }
                    }
                ]
            } data={fileList}/>

        </Wrapper>

    )
}

export default List;