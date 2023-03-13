import React from "react";
import "./LandingPage.css";
import chat from "../../images/chat.jpg";
import LandingBody from "../../components/LandingBody/LandingBody";

const LandingPage = () => {
    return(
        <div id="landing-page">
            <div className="image-col">
                <img src={chat} alt="chatImage" id="chat-image"/>
            </div>
            <div className="form-col">
                <LandingBody />
            </div>
        </div>
    );
};

export default LandingPage;