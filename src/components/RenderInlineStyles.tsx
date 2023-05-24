import { useState } from "react";
import { EditorState, RichUtils } from "draft-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faCode,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

interface InlineStyle {
  label: string;
  style: string;
  icon?: React.ReactNode;
}

interface ToolbarItemProps {
  isactive: number;
  onClick: () => void;
  children: React.ReactNode;
}

interface RenderInlineStylesProps {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}

const inlineStyles: InlineStyle[] = [
  { label: "Bold", style: "BOLD", icon: <FontAwesomeIcon icon={faBold} /> },
  {
    label: "Italic",
    style: "ITALIC",
    icon: <FontAwesomeIcon icon={faItalic} />,
  },
  {
    label: "Underline",
    style: "UNDERLINE",
    icon: <FontAwesomeIcon icon={faUnderline} />,
  },
  {
    label: "Strikethrough",
    style: "STRIKETHROUGH",
    icon: <FontAwesomeIcon icon={faStrikethrough} />,
  },
  { label: "Code", style: "CODE", icon: <FontAwesomeIcon icon={faCode} /> },
];

export const RenderInlineStyles = ({
  editorState,
  setEditorState,
}: RenderInlineStylesProps) => {
  const applyStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const isActive = (style: string) => {
    const currentStyle = editorState.getCurrentInlineStyle();
    return currentStyle.has(style);
  };

  return (
    <Container>
      {inlineStyles.map((item, index) => {
        return (
          <ToolbarItem
            isactive={isActive(item.style) ? 1 : 0}
            onClick={() => applyStyle(item.style)}
            key={`${item.label}-${index}`}
          >
            {item.icon || item.label}
          </ToolbarItem>
        );
      })}
    </Container>
  );
};

export const Container = styled.div`
  display: flex;
  gap: 7px;
`;

export const ToolbarItem = styled.div<ToolbarItemProps>`
  width: 28px;
  height: 27px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
  /* box-shadow: 0px 1px 11px 1px rgba(15, 15, 15, 0.2); */
  /* background-color: #34495e; */
  color: #34495e;
  font-size: 16px;
  font-family: Oxygen, sans-serif;
  transition: all 250ms ease-in-out;
  cursor: pointer;

  ${({ isactive }: any) =>
    isactive &&
    `    transform: translateY(1px);
    color: #34495e;
    background-color: transparent;
    box-shadow: none;
     border: 1px solid #34495e;`}

  &:hover {
    transform: translateY(1px);
    color: #34495e;
    background-color: transparent;
    box-shadow: none;
    border: 1px solid #34495e;
  }
`;
