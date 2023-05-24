import styled from "styled-components";
import { RenderInlineStyles } from "./RenderInlineStyles";

interface ToolBarProps {
  editorState: any;
  setEditorState: any;
}

const ToolBar: React.FC<ToolBarProps> = ({ editorState, setEditorState }) => {
  return (
    <ToolbarContainer>
      <RenderInlineStyles
        editorState={editorState}
        setEditorState={setEditorState}
      />
    </ToolbarContainer>
  );
};

export default ToolBar;
const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 38px;
  padding: 5px 7px;
  margin-bottom: 8px;
  border: 1px solid #e7f1e9;
  border-radius: 5px;
  background: #fff;
  width: fit-content;
  /* box-shadow: 0px 0px 3px 1px rgba(15, 15, 15, 0.17); */
`;
