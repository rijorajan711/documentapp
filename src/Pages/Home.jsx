import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SendIcon from "@mui/icons-material/Send";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, CardActions, Modal } from "@mui/material";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Box from "@mui/material/Box";

import { v4 } from "uuid";
import { async } from "@firebase/util";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",

  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Home() {
  const [textWrittenByUser, setTextWrittenByUser] = useState("");
  const [fileWrittenByUser, setFiletWrittenByUser] = useState("");
  const [downloadedFileUrl, setDownloadedFileUrl] = useState("");
  const [allDataFromFirebaseStore, setAllDataFromFirebaseStore] = useState([]);
  const [open, setOpen] = useState(false);
  const [quillValue, setQuillValue] = useState("");
  const [editingDetails, setEditingDetails] = useState({});

  const homeBackgrondImage =
    "https://img.freepik.com/free-vector/abstract-blue-circle-black-background-technology_1142-12714.jpg";

  const collectionReff = collection(db, "totalData");

  //user text saving to state

  const setTextWrittenByUserFunction = (e) => {
    setTextWrittenByUser(e.target.value);
    console.log(textWrittenByUser);
  };

  //////////////////////////////////////////////////////////////////////////////

  //adding image to store in js

  const setFilewrittenByUserFunction = (e) => {
    setFiletWrittenByUser(e.target.files[0]);
    console.log(fileWrittenByUser);
    const storageRef = ref(storage, `images/${fileWrittenByUser.name + v4()}`);
    const uploadTask = uploadBytesResumable(storageRef, fileWrittenByUser);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        console.log("there is an error", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setDownloadedFileUrl(downloadURL);
        });
      }
    );
  };
  //////////////////////////////////////////////////////////////////////////

  //add data to firestore

  const submitEnterDataOnclick = async () => {
    await addDoc(collectionReff, {
      content: textWrittenByUser,
      imgURL: downloadedFileUrl,
    });
    setTextWrittenByUser(null);
    setDownloadedFileUrl("");
    getAllDetailsFromFireStore();
  };

  //////////////////////////////////////////////////////////////////

  //get data from firestore

  const getAllDetailsFromFireStore = async () => {
    const data = await getDocs(collectionReff);

    setAllDataFromFirebaseStore(
      data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
  };

  console.log(allDataFromFirebaseStore);

  useEffect(() => {
    getAllDetailsFromFireStore();
  }, []);

  //////////////////////////////////////////////////////////////////////
  //delete document
  const deleteDocument = async (id) => {
    const deleteRef = doc(db, "totalData", id);
    await deleteDoc(deleteRef);
    getAllDetailsFromFireStore();
  };

  ///////////////////////////////////////////////////////////////////////
  //modeal open function
  const handleOpen = (id, content, imageUrl) => {
    setOpen(true);
    setEditingDetails({ id, content, imageUrl });
    setQuillValue(content);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //////////////////////////////////////////////////////////////////////
  //update content

  const updatingContent = async () => {
    const userDoc = doc(db, "totalData", editingDetails?.id);
    const editedData = { content: quillValue, imgURL: editingDetails.imageUrl };
    await updateDoc(userDoc, editedData);
    getAllDetailsFromFireStore();
    handleClose();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-no-repeat "
      style={{ backgroundImage: `url(${homeBackgrondImage})` }}
    >
      <div className="flex gap-5 mt-16">
        <TextField
          required
          id="outlined-required"
          placeholder="Type Content"
          defaultValue={textWrittenByUser}
          onChange={(e) => setTextWrittenByUserFunction(e)}
          sx={{
            backgroundColor: "white",
            height: "55px",
            width: "400px",
            borderRadius: "5px",
          }}
        />

        <Button
          sx={{ height: "55px" }}
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput
            type="file"
            onChange={(e) => setFilewrittenByUserFunction(e)}
          />
        </Button>
      </div>
      {downloadedFileUrl && (
        <div className="mt-5 w-[500px] h-12">
          <Button
            onClick={submitEnterDataOnclick}
            sx={{ width: "100%", height: "100%" }}
            variant="contained"
            endIcon={<SendIcon />}
          >
            Send
          </Button>
        </div>
      )}
      <div className="w-full p-5  flex justify-center flex-wrap gap-5">
        {allDataFromFirebaseStore?.map((data) => {
          return (
            <Card sx={{ minWidth: 345, maxWidth: 346, maxHeight: 600 }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  sx={{ height: "200px" }}
                  height="140"
                  image={data.imgURL}
                  alt="green iguana"
                />
                <CardContent>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    dangerouslySetInnerHTML={{ __html: data.content }}
                  />
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button
                  onClick={() => handleOpen(data.id, data.content, data.imgURL)}
                  sx={{ backgroundColor: "#0d6b65", color: "white" }}
                  size="small"
                  variant="contained"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    deleteDocument(data.id);
                  }}
                  sx={{ backgroundColor: "#0d6b65", color: "white" }}
                  size="small"
                  variant="contained"
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          );
        })}

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <ReactQuill value={quillValue} onChange={setQuillValue} />
            </Typography>
            <Button
              onClick={updatingContent}
              sx={{
                backgroundColor: "#0d6b65",
                color: "white",
                marginTop: "10px",
              }}
              size="small"
              variant="contained"
            >
              Update
            </Button>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default Home;
