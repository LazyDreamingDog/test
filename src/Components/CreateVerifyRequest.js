import React, {useState, createContext, useContext} from 'react';
import 'antd/dist/antd.min.css';
import '../index.css';
import {Form, Input, Select, Steps, Button, message, Upload, Collapse, Result, Card, Typography} from 'antd';
import {useNavigate} from "react-router-dom";
import {
    FileDoneOutlined,
    InboxOutlined, FileSearchOutlined, ToTopOutlined, IdcardOutlined, FileSyncOutlined
} from '@ant-design/icons';
import axios from "axios";
import Helmet from 'react-helmet'

const Contex = createContext(undefined);

const ip_port = "http://139.159.141.28:8080/";

const { Step } = Steps;
const { Panel } = Collapse;
const { Dragger } = Upload;
const { Paragraph } = Typography;

function callback(key) {
    console.log(key);
}

const steps = [
    {
        title: '查询验证规则',
        content: 'First-content',
        icon: <FileSearchOutlined />,
    },
    {
        title: '确认验证规则',
        content: 'Second-content',
        icon: <FileDoneOutlined />,
    },
    {
        title: '提交凭证',
        content: 'Last-content',
        icon: <ToTopOutlined />,
    },
    {
        title: '凭证展示',
        content: 'Last-content',
        icon: <IdcardOutlined />,
    },
    {
        title: '生成验证请求',
        content: 'Last-content',
        icon: <FileSyncOutlined />,
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

const SearchVerifyRules = () => {

    const {
        templateinfo, setTemplateinfo,
        verifyRule, setVerifyRule
    } = useContext(Contex);
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log(values);
        console.log({
            issuerDID: values.issuerdid,
            templateName: values.templatename,
            ruleName: values.rulename
        });
        axios.post(ip_port + 'getVerifyRuleView', {
            issuerDID: values.issuerdid,
            templateName: values.templatename,
            ruleName: values.rulename
        }).then(res=>{
            console.log(res.data);
            setVerifyRule(res.data);
            console.log(verifyRule);
        })
        axios.post(ip_port + 'getTemplateView', {
            issuerDID: values.issuerdid,
            templateName: values.templatename
        }).then(res=>{
            console.log(res.data);
            setTemplateinfo(res.data);
            console.log(templateinfo);
        })
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <Form {...layout} form={form} name="search_verify_rules" onFinish={onFinish} validateMessages={validateMessages}>
            <Form.Item
                name="issuerdid"
                label="凭证签发者DID"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="templatename"
                label="模板名"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="rulename"
                label="验证规则名"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                    提交
                </Button>
                <Button htmlType="button" onClick={onReset}>
                    重置
                </Button>
            </Form.Item>
        </Form>
    );

};


const ShowRule = () => {
    const {verifyRule, setVerifyRule} = useContext(Contex);
    return (
        <>
            <Card title="须证明属性">
                {verifyRule.predicateDescriptionList.map((item, index)=>(
                    <Card
                        style={{
                            marginTop: 16,
                            width: 200,
                        }}
                        type="inner"
                        title={"属性" + item.split(" ")[0]}
                        key={index}
                    >
                        {"要求" + item}
                    </Card>
                ))}
            </Card>
            <Card title="须披露属性">
                {verifyRule.revealedAttributeList.map((item, index)=>(
                    <Card
                        style={{
                            marginTop: 16,
                            width: 300,
                        }}
                        type="inner"
                        key={index}
                    >
                        {item}
                    </Card>
                ))}
            </Card>
            <Card title="规则信息"
                  style={{
                      marginTop: 16
                  }}>
                <Card
                    style={{
                        marginTop: 16,
                    }}
                    type="inner"
                    title="模板描述"
                >
                    {verifyRule.description}
                </Card>
            </Card>
        </>
    )
};

const UploadCredential = () => {

    const {
        credential, setCredential,
        newCredential, setNewCredential,
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
                setCredential(JSON.parse(targetNum));
                console.log(credential);
            }
            return false;
        }
    };

    return (
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或将凭证文件拖拽到此处</p>
            <p className="ant-upload-hint">
                请上传你的凭证
            </p>
        </Dragger>
    );

};

const ShowCredential = () => {

    const {
        newCredential, credential, verifyRule
    } = useContext(Contex);

    return(
        <>
            <Card title="须证明属性">
                {verifyRule.predicateDescriptionList.map((item, index)=>(
                    <Card
                        style={{
                            marginTop: 16,
                        }}
                        type="inner"
                        title={"属性: " + item.split(" ")[0]}
                        key={index}
                    >
                        {item}
                    </Card>
                ))}
            </Card>
            <Card title="须披露属性">
                {verifyRule.revealedAttributeList.map((item, index)=>(
                    <Card
                        style={{
                            marginTop: 16,
                        }}
                        type="inner"
                        key={index}
                        title={"属性: " + item.split(" ")[0]}
                    >
                        {credential.attributeMap[item]}
                    </Card>
                ))}
            </Card>
            <Card title="凭证匿名化展示"
                  style={{
                      marginTop: 16
                  }}>
                <Card
                    style={{
                        marginTop: 16,
                    }}
                    type="inner"
                    title="原签名"
                >
                    <Paragraph
                        ellipsis={{
                            expandable: true,
                            symbol: "展开",
                            onEllipsis: ellipsis => {
                                console.log('Ellipsis changed:', ellipsis);
                            },
                        }}
                        title="原签名"
                    >
                        {credential.certificateSignature}
                    </Paragraph>
                </Card>
                <Card
                    style={{
                        marginTop: 16,
                    }}
                    type="inner"
                    title="新签名"
                >
                    <Paragraph
                        ellipsis={{
                            expandable: true,
                            symbol: "展开",
                            onEllipsis: ellipsis => {
                                console.log('Ellipsis changed:', ellipsis);
                            },
                        }}
                        title="新签名"
                    >
                        {newCredential.certificateSignature}
                    </Paragraph>
                </Card>
            </Card>
        </>
    )
};

const Success = () => {
    let text = "生成验证请求成功!";
    return (
        <Result
            status="success"
            title={text}
        />
    )
};


const CreateVerifyRequest = () => {
    const [current, setCurrent] = React.useState(0);
    const naviate = useNavigate();

    const [templateinfo, setTemplateinfo] = useState({
        schema: [
            'age',
            'gender'
        ],
        templateName: 'xxxix',
        description: 'xxxix',
        issuerDID: 'xxxix'
    });
    const [certificate, setCertificate] = useState(undefined);
    const [credential, setCredential] = useState(undefined);
    const [quest, setQuest] = useState(undefined);
    const [predicateDescriptionList, setPredicateDescriptionList] = useState(undefined);
    const [revealedAttributeList, setRevealedAttributeList] = useState(undefined);
    const [verifyRule, setVerifyRule] = useState(undefined);
    const [newCredential, setNewCredential] = useState(undefined);

    const changesignature = () => {
        let data = {
            signResult: [
                credential.certificateSignature,
                credential.issuerNonce
            ],
            issuerDID: credential.templateInfo.issuerDID,
            templateName: credential.templateInfo.templateName,
            certificateName: credential.certificateName
        };
        console.log(data);
        axios.post(ip_port + 'getCertificateSignature', data
        ).then(res=>{
            console.log(res.data);
            setNewCredential(res.data);
            console.log(newCredential);
            setCurrent(current + 1);
        })
    };

    const createverifyrequest = () => {
        console.log({
            issuerDID: templateinfo.issuerDID,
            templateName: templateinfo.templateName,
            certificateName: credential.certificateName,
            ruleName: verifyRule.ruleName
        });
        axios.post(ip_port + 'generateVerifyRequest', {
            issuerDID: templateinfo.issuerDID,
            templateName: templateinfo.templateName,
            certificateName: credential.certificateName,
            ruleName: verifyRule.ruleName
        }).then(res=>{
            console.log(res.data);
            var FileSaver = require('file-saver');
            let content = JSON.stringify(res.data);
            console.log(content);
            let blob = new Blob([content], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, "verifyrequest.txt");
            setCurrent(current + 1);
            setQuest(res.data);
            console.log(quest);
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
                    templateinfo, setTemplateinfo,
                    certificate, setCertificate,
                    credential, setCredential,
                    predicateDescriptionList, setPredicateDescriptionList,
                    revealedAttributeList, setRevealedAttributeList,
                    verifyRule, setVerifyRule,
                    newCredential, setNewCredential
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
                                <SearchVerifyRules/>
                            )}
                            {current === 1 && (
                                <ShowRule/>
                            )}
                            {current === 2 && (
                                <UploadCredential/>
                            )}
                            {current === 3 && (
                                <ShowCredential/>
                            )}
                            {current === 4 && (
                                <Success />
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
                            <Button type="primary" onClick={() => next()}>
                                下一步
                            </Button>
                        )}
                        {current === 2 && (
                            <Button type="primary" onClick={() => changesignature()}>
                                下一步
                            </Button>
                        )}
                        {current === 3 && (
                            <Button type="primary" onClick={() => createverifyrequest()}>
                                下一步
                            </Button>
                        )}
                        {current === 4 && (
                            <Button type="primary" onClick={() => done()}>
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

export default CreateVerifyRequest;