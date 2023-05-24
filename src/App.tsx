import { useEffect, useState, useRef } from "react";
import { EditorWrapper, EditorContainer } from "./App.styles";
import { Editor, EditorState, AtomicBlockUtils, ContentBlock } from "draft-js";

import {
  Box,
  TextField,
  IconButton,
  Stack,
  Typography,
  Button,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import { Add } from "@mui/icons-material";
import ToolBar from "./components/Toolbar";
import ModalContainer from "./components/Modal";

function App() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [wordLenth, setWordLenth] = useState(0);
  const [totalWordLength] = useState(1000);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const handleOpenMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  function getWordCount(editorState: EditorState) {
    const contentState = editorState.getCurrentContent();
    const blockMap = contentState.getBlockMap();
    let wordCount = 0;
    blockMap.forEach((block: any) => {
      const regex = /\\s+/gi;
      const text = block.getText();
      const wordCountPerBlock = text
        .trim()
        .replace(regex, " ")
        .split("").length;

      wordCount += wordCountPerBlock;
    });
    return wordCount;
  }
  useEffect(() => {
    setWordLenth(getWordCount(editorState));
  }, [editorState]);

  // =======image upload==========
  const handleImageFileClick = () => {
    if (imageInputRef.current !== null) {
      imageInputRef.current.click();
    }
  };
  const handleImageUpload = () => {
    if (imageInputRef && imageInputRef.current) {
      let img = imageInputRef.current;
      if (img && img.files) {
        const file = img.files[0];

        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
          const contentState = editorState.getCurrentContent();
          const contentStateWithEntity = contentState.createEntity(
            "IMAGE",
            "IMMUTABLE",
            { src: reader.result }
          );
          const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
          const newEditorState = EditorState.set(editorState, {
            currentContent: contentStateWithEntity,
          });
          setEditorState(
            AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ")
          );
        };
        reader.readAsDataURL(file);
        setImageModalOpen(false);
      }
    }
  };

  // ===================

  // =====video upload ============
  const handleVideoFileEmbed = () => {
    console.log(videoUrl);
    if (videoUrl && videoUrl.length > 0) {
      const videoId = videoUrl[1];

      const videoEmbedUrl = `https://www.youtube.com/embed/FKqlAbsGlg0`;
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        "VIDEO",
        "IMMUTABLE",
        { src: videoEmbedUrl }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = EditorState.set(editorState, {
        currentContent: contentStateWithEntity,
      });
      setEditorState(
        AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ")
      );
    }
    setVideoUrl("");
  };
  // ==============================

  const mediaBlockRenderer = (block: ContentBlock) => {
    if (block.getType() === "atomic") {
      const contentState = editorState.getCurrentContent();
      const entity = contentState.getEntity(block.getEntityAt(0));
      const type = entity.getType();

      if (type === "IMAGE") {
        return {
          component: ImageComponent,
          editable: false,
        };
      } else if (type === "VIDEO") {
        return {
          component: VideoComponent,
          editable: false,
        };
      }
    }
    return null;
  };
  const ImageComponent = (props: any) => {
    const entity = props.contentState.getEntity(props.block.getEntityAt(0));
    const { src } = entity.getData();

    return (
      <img
        src={src}
        style={{ height: "500px", width: "100%", objectFit: "cover" }}
      />
    );
  };

  const VideoComponent = (props: any) => {
    const entity = props.contentState.getEntity(props.block.getEntityAt(0));
    const { src } = entity.getData();

    return (
      <iframe
        width="100%"
        height="315"
        src={src}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  };
  return (
    <EditorWrapper>
      <Box
        sx={{
          minHeight: "40px",
          boxShadow: "0px 0px 1px 1px #E7F1E9",
          background: "#fafafa",
          borderRadius: " 3px 3px 0 0 ",
          mb: "1px",
        }}
      ></Box>
      <EditorContainer>
        <Typography variant="h3">This is the title</Typography>
        <ToolBar editorState={editorState} setEditorState={setEditorState} />
        <Stack direction="column">
          <Editor
            placeholder="Start writing here..."
            editorState={editorState}
            onChange={setEditorState}
            blockRendererFn={mediaBlockRenderer}
          />
          <Box display="flex" flexDirection="row" width="fit-content" mt="2rem">
            <IconButton
              aria-label="plus"
              color="success"
              onClick={handleOpenMenu}
            >
              <Add />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  setImageModalOpen(true);
                }}
              >
                <ListItemIcon>
                  <ImageIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Picture</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  setVideoModalOpen(true);
                }}
              >
                <ListItemIcon>
                  <VideocamIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Video</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Stack>
      </EditorContainer>
      <Box
        sx={{
          background: "#fff",
          textAlign: "right",
          padding: "8px",
          borderRadius: "0 0 3px 3px ",
        }}
      >
        {wordLenth}/{totalWordLength} words
      </Box>
      <Stack
        direction="row"
        justifyContent="center"
        sx={{
          position: "absolute",
          bottom: "-50px",
          right: "10px",
          zIndex: "10",
        }}
      >
        <Button variant="contained" color="success">
          Post
        </Button>
      </Stack>
      <ModalContainer open={imageModalOpen} onClose={setImageModalOpen}>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Embed
          </Typography>
          <Typography component="span">Upload Images</Typography>

          <Box
            component="span"
            sx={{
              p: 2,
              border: "1px dashed grey",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <input
              type="file"
              id="myInput"
              ref={imageInputRef}
              style={{ display: "none" }}
              accept="image/*"
            />
            <Button
              variant="outlined"
              color="success"
              onClick={handleImageFileClick}
            >
              Import image from Device
            </Button>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="success"
              onClick={handleImageUpload}
            >
              Embed
            </Button>
            <Button
              variant="outlined"
              color="success"
              onClick={() => setImageModalOpen(false)}
            >
              Close
            </Button>
          </Stack>
        </Stack>
      </ModalContainer>
      <ModalContainer open={videoModalOpen} onClose={setVideoModalOpen}>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Embed
          </Typography>
          <Typography component="span">Url Link</Typography>

          <TextField
            hiddenLabel
            id="outlined-basic"
            size="small"
            variant="outlined"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            sx={{ background: "#E7F1E9", outline: "none" }}
          />

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                setVideoModalOpen(false);
                handleVideoFileEmbed();
              }}
            >
              Embed
            </Button>
            <Button
              variant="outlined"
              color="success"
              onClick={() => setVideoModalOpen(false)}
            >
              Close
            </Button>
          </Stack>
        </Stack>
      </ModalContainer>
    </EditorWrapper>
  );
}

export default App;
