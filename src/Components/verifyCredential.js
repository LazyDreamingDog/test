import React, {useState, createContext, useContext} from 'react';
import 'antd/dist/antd.min.css';
import '../index.css';
import {Form, Input, Select, Steps, Button, message, Upload, Collapse, Result, Card} from 'antd';
import {useNavigate} from "react-router-dom";
import Icon, {
    UserOutlined,
    SolutionOutlined,
    LoadingOutlined,
    SmileOutlined,
    FileDoneOutlined,
    MinusCircleOutlined, PlusOutlined,
    InboxOutlined, CloudDownloadOutlined, CloudUploadOutlined, QuestionOutlined
} from '@ant-design/icons';
import axios from "axios";
import Helmet from 'react-helmet'

const Contex = createContext(undefined);

const ip_port = "http://139.159.141.28:8080/";

const { Step } = Steps;
const { Panel } = Collapse;
const { Dragger } = Upload;

function callback(key) {
    console.log(key);
}

const steps = [
    {
        title: '获取验证请求',
        content: 'First-content',
        icon: <CloudDownloadOutlined />,
    },
    {
        title: '提交验证规则',
        content: 'Second-content',
        icon: <CloudUploadOutlined />,
    },
    {
        title: '验证',
        content: 'Last-content',
        icon: <QuestionOutlined />,
    },
];
const { Option } = Select;
const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 8,
    },
};

/* eslint-disable no-template-curly-in-string */

const validateMessages = {
    required: '${label} 不能为空!'
};

const UploadRequest = () => {
    const {
        request, setRequest
    } = useContext(Contex);

    const props = {
        name: 'file',
        //action: `上传文件的接口地址`,
        headers: {
        },// 请求头
        showUploadList: true,
        maxCount: 1,
        beforeUpload:file=> {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = (result) => {
                let targetNum = result.target.result;
                // targetNum是文件内容 type为string
                console.log(targetNum);
                setRequest(JSON.parse(targetNum));
                console.log(request);
            }
            return false;
        }
    };

    return (
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或将请求文件拖拽到此处</p>
            <p className="ant-upload-hint">
                上传验证请求
            </p>
        </Dragger>
    )
};

const UploadRule = () => {
    const {
        rule, setRule
    } = useContext(Contex);

    const props = {
        name: 'file',
        //action: `上传文件的接口地址`,
        headers: {
        },// 请求头
        showUploadList: true,
        maxCount: 1,
        beforeUpload:file=> {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = (result) => {
                let targetNum = result.target.result;
                // targetNum是文件内容 type为string
                console.log(targetNum);
                setRule(JSON.parse(targetNum));
                console.log(rule);
            }
            return false;
        }
    };

    return (
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或将验证规则文件拖拽到此处</p>
            <p className="ant-upload-hint">
                上传验证规则
            </p>
        </Dragger>
    )
};


const Success = () => {
    let text = "验证成功!";
    return (
        <Result
            status="success"
            title={text}
        />
    )
};

const Failure = () => {
    let text = "验证失败!";
    return (
        <Result
            status="error"
            title={text}
        />
    )
};

const VerifyCredential = () => {
    const [current, setCurrent] = React.useState(0);
    const naviate = useNavigate();
    const [rule, setRule] = useState(undefined);

    const [request, setRequest] = useState(undefined);
    const [boolstate, setBoolstate] = useState(false);

    const verifycredential = () => {
        console.log(rule);
        axios.post(ip_port + 'verifyCertificate', {
            encodedVerifyRule: rule,
            verifyRequest: request.verifyRequest,
            certificateTemplate: request.certificateTemplate
        }).then(res=>{
            setBoolstate(res.data);
            console.log(boolstate);
            setCurrent(current + 1);
        })

    };

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const done = () => {
        message.success('Processing complete!');
        naviate('/');
    };

    return (
        <>
            <Helmet
                meta = {[
                    {httpEquiv:"Content-Security-Policy",content:"upgrade-insecure-requests"}
                ]}
            />
            <Contex.Provider
                value={{
                    rule, setRule,
                    request, setRequest
                }}>
                <>
                    <Steps current={current}>
                        {steps.map(item => (
                            <Step key={item.title} title={item.title} icon={item.icon}/>
                        ))}
                    </Steps>
                    <div className="steps-content">
                        <div>
                            {current === 0 && (
                                <UploadRequest/>
                            )}
                            {current === 1 && (
                                <UploadRule/>
                            )}
                            {current === 2 && boolstate && (
                                <Success />
                            )}
                            {current === 2 && !boolstate && (
                                <Failure />
                            )}
                        </div>
                    </div>
                    <div className="steps-action">
                        {current === 0 && (
                            <Button type="primary" onClick={() => next()}>
                                下一步
                            </Button>
                        )}
                        {current === 1 && (
                            <Button type="primary" onClick={() => verifycredential()}>
                                下一步
                            </Button>
                        )}
                        {current === 2 && (
                            <Button type="primary" onClick={() => next()}>
                                下一步
                            </Button>
                        )}
                        {current > 0 && (
                            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                                上一步
                            </Button>
                        )}
                    </div>
                </>
            </Contex.Provider>
        </>

    );
};

export default VerifyCredential;

