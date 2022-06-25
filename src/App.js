import React from 'react';
import './newApp.css';
import {Helmet} from "react-helmet";
import {PauseCircleTwoTone} from "@ant-design/icons";

var sectionStyle = {
    height: "800px",
// makesure here is String确保这里是一个字符串，以下是es6写法
    backgroundImage: "url(" + require('../src/img/lighthouse.jpg') + ")"
};

const App = () => (
    <>
        <div
            className="container"
            style={{backgroundImage: "url(" + require('../src/img/lighthouse.jpg') + ")"}}>
            <div className="first_box">
                {/*<div className="header">ToTo-Pay</div>*/}
                {/*<div className="welcome">*/}

                {/*    <span ><a href="http://139.159.141.28:8080/createWeId" target="_blank" rel="noopener noreferrer">进入系统</a></span>*/}
                {/*</div>*/}
            </div>
            <div className="first_box">
                <div className="header">
                    匿名凭证系统
                </div>
                <div className="index_box">
                    <span><a style={{color: '#ffffff80'}} href="http://119.3.139.4">进入系统</a></span>
                </div>
            </div>
        </div>
    </>
);

export default App;
