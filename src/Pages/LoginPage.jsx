import {
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Button,
} from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import { provider, auth } from "../firebaseConfig";
import { signInWithPopup, signOut } from "firebase/auth";
import { Link } from "react-router-dom";

function LoginPage() {
    // display after login
    const [profileDisplay, setProfileDisplay] = useState("none");
    //user is present or not

    const [signInUseState, setSignInUseState] = useState("");
    const loginBackgroungImage =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNTS9-7w5IlOl18m_jrQ5Vhvea0GEYUk44ow&usqp=CAU";
    let profilePicture;
    if (localStorage.getItem("name")) {
        profilePicture = localStorage.getItem("pictureurl");
    } else {
        profilePicture =
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoQVrbuN3d511Qc0-VknHNWYF_vHm0TcLdgVbtlYhMOKvlAjwQLuA-s8283avcoG89854&usqp=CAU";
    }

    //google signup
    const signInWithGoogle = ()=>{
        signInWithPopup(auth, provider).then((result) => {
            localStorage.setItem("name", result.user.displayName);
            localStorage.setItem("email", result.user.email);
            localStorage.setItem("pictureurl", result.user.photoURL);
            setSignInUseState(localStorage.getItem("name"));
        }).catch((err)=>{
            window.location.reload()
        })
    } ;

    const signOutWithGoogle = () => {
        signOut(auth).then(() => {
            localStorage.clear();
            setSignInUseState("");
        });
    };
    useEffect(()=>{
        setSignInUseState(localStorage.getItem("name"));
    },[])

    useEffect(() => {
        if (signInUseState) {
            setProfileDisplay("block");
        } else {
            setProfileDisplay("none");
        }

    }, [signInUseState]);

    return (
        <div
            className="min-h-screen bg-no-repeat bg-cover flex flex-col justify-center items-center"
            style={{ backgroundImage: `url(${loginBackgroungImage})` }}
        >
            <div >
                <Card
                    sx={{
                        height: "700px",
                        Width:"700px",
                        backgroundColor: "black",
                        borderRadius: "10px",
                        
                    }}
                >
                    <CardActionArea>
                        <CardMedia
                            sx={{ height: "300px" }}
                            component="img"
                            height="140"
                            image={profilePicture}
                            alt="green iguana"
                        />
                        <CardContent sx={{ display: profileDisplay, color: "white",marginTop:"20px" }}>
                            <Typography gutterBottom variant="h6" component="div">
                                {`Hellow ${localStorage?.getItem("name")}`}
                            </Typography>
                            <Typography gutterBottom variant="h5" component="div">
                                {`Email: ${localStorage?.getItem("email")}`}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                
                    <CardActions
                        sx={{
                            backgroundColor: "black",
                            height: "40px",
                            marginBottom: "5px",
                            display: "flex",
                            marginTop:"100px",
                            marginLeft:"20px"
                        }}
                    >
                        <Button
                            sx={{ backgroundColor: "#a88d11",height:"75px" }}
                            size="small"
                            variant="contained"
                            onClick={signInWithGoogle}
                        >
                            Sign With Google
                        </Button>
                        <Link className="ml-2" to={"/home"}>
                            {" "}
                            <Button
                                sx={{ display: profileDisplay,backgroundColor:"#debdcc",color:"black" }}
                                size="small"
                                variant="contained"
                             >
                                Home
                            </Button>
                        </Link>

                        <Button
                            sx={{ backgroundColor: "#a88d11", display: profileDisplay,height:"75px" }}
                            size="small"
                            variant="contained"
                            onClick={signOutWithGoogle}
                        >
                            Sign Out Google
                        </Button>
                    </CardActions>
                </Card>
            </div>
        </div>
    );
}

export default LoginPage;
