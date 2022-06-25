import React, {useState, createContext, useContext} from 'react';
import 'antd/dist/antd.min.css';
import '../index.css';
import { Form, Input, Select, Steps, Button, message, Space, Collapse, Result } from 'antd';
import { Card } from 'antd';
import {useNavigate} from "react-router-dom";
import {
    FileDoneOutlined,
    FolderOpenOutlined, FileSearchOutlined, FormOutlined, AuditOutlined
} from '@ant-design/icons';
import axios from "axios";
import Helmet from 'react-helmet'

const Contex = createContext(undefined);

const ip_port = "http://139.159.141.28:8080/";

const { Step } = Steps;
const { Panel } = Collapse;

function callback(key) {
    console.log(key);
}

const steps = [
    {
        title: '选择保存路径',
        content: 'First-content',
        icon: <FolderOpenOutlined />,
    },
    {
        title: '查找模板',
        content: 'Second-content',
        icon: <FileSearchOutlined />,
    },
    {
        title: '确认模板',
        content: 'Second-content',
        icon: <FileDoneOutlined />,
    },
    {
        title: '填写属性',
        content: 'Second-content',
        icon: <FormOutlined />,
    },
    {
        title: '凭证签发',
        content: 'Last-content',
        icon: <AuditOutlined />,
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

const SearchFile = () => {
    const {savepath, setSavepath} = useContext(Contex);
    const [form] = Form.useForm();
    const onModeChange = (value) => {
        switch (value) {
            case 'default':
                form.setFieldsValue({
                    path: 'D:/QGH/DID',
                });
                return;

            case 'optional':
                form.setFieldsValue({
                    path: '',
                });
        }
    };

    const onFinish = (values) => {
        console.log(values);
        setSavepath(values);
        console.log(savepath);
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
            <Form.Item
                name="mode"
                label="模式"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select
                    placeholder="选择保存路径填充模式"
                    onChange={onModeChange}
                    allowClear
                >
                    <Option value="default">默认路径</Option>
                    <Option value="optional">自选路径</Option>
                </Select>
            </Form.Item>
            <Form.Item
                name="path"
                label="路径"
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

const SearchTemplate = () => {
    const {templateinfo, setTemplateinfo} = useContext(Contex);
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log(values);
        setTemplateinfo(values);
        console.log(templateinfo);
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
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
                name="tempaltename"
                label="模板名"
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

const ShowTemplate = () => {
    const {diddoc} = useContext(Contex);
    const {templateinfo, setTemplateinfo} = useContext(Contex)
    return (
        <>
            <Card title="模板">
                {templateinfo.schema.map(item=>(
                    <Card
                        style={{
                            marginTop: 16,
                        }}
                        type="inner"
                        title="所需属性"
                    >
                        {item}
                    </Card>
                ))}
            </Card>
            <Card title="模板信息"
                  style={{
                      marginTop: 16
                  }}>
                <Card
                    style={{
                        marginTop: 16,
                    }}
                    type="inner"
                    title="模板名"
                >
                    {templateinfo.templateName}
                </Card>
                <Card
                    style={{
                        marginTop: 16,
                    }}
                    type="inner"
                    title="模板描述"
                >
                    {templateinfo.description}
                </Card>
                <Card
                    style={{
                        marginTop: 16,
                    }}
                    type="inner"
                    title="签发者"
                >
                    {templateinfo.issuerDID}
                </Card>
            </Card>
        </>
    )
};

const FillTemplate = () => {
    const {templateinfo, certificate, setCertificate, map, setMap} = useContext(Contex);
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log(values);
        setMap(values);
        console.log(setMap);
        let arr = [];
        Object.keys(values).forEach(function(key) {
            if(key!=='userdid' && key!=='certificatename')
            {
                arr.push(values[key]);
            }
        });
        console.log(arr);
        let filledtemplate = {
            preValue: arr,
            issuerDID: templateinfo.issuerDID,
            templateName: templateinfo.templateName,
            certificateName: values.certificatename,
            userDID: values.userdid
        }
        console.log(filledtemplate);
        setCertificate(filledtemplate);
        console.log(certificate);
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
            {templateinfo.schema.map(item=>(
                <Form.Item
                    name={item}
                    label={item}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            ))}
            <Form.Item
                name="userdid"
                label="DID"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="certificatename"
                label="凭证名"
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

const Success = () => {
    const {savepath} = useContext(Contex);
    let text = "DID文件保存成功!";
    let text_path = "存储路径为:" + savepath;
    return (
        <Result
            status="success"
            title={text}
            subTitle={text_path}
        />
    )
};

const CreateCredential = () => {
    const [current, setCurrent] = React.useState(0);
    const naviate = useNavigate();
    const [savepath, setSavepath] = useState('D:/QGH/DID');
    const [diddoc, setDiddoc] = useState({
        weId : '112233445566',
        publicKey : '123456789',
        privateKey : '123456789'
    });

    const [templateinfo, setTemplateinfo] = useState(
        undefined
    )

    const [certificate, setCertificate] = useState(undefined);
    const [signdata, setSigndata] = useState(undefined);
    const [blindcertificate, setBlindcertificate] = useState(undefined);
    const [map, setMap] = useState(undefined);
    const [credential, setCredential] = useState(undefined);

    const searchtemplate = () => {
        axios.post(ip_port + 'getTemplateView', {
            issuerDID:templateinfo.issuerdid,
            templateName:templateinfo.tempaltename
        }).then(res=>{
            console.log(res.data);
            setTemplateinfo(res.data);
            console.log(templateinfo);
            setCurrent(current + 1);
        });
    };

    const createcredential = () => {

        let signpost = {
            issuerDID: certificate.issuerDID,
            templateName: certificate.templateName,
            certificateName: certificate.certificateName,
            userDID: certificate.userDID
        };

        axios.post(ip_port + 'fillCertificate',
            certificate
        ).then(res=>{
            console.log(res.data);
            let info = res.data;
            Object.keys(info.attributeMap).forEach(function(key) {
                info.attributeMap[key]=map[key];
            });
            setCredential(info);

            console.log(signpost);
            axios.post(ip_port + 'signCertificate',
                {
                    issuerDID: certificate.issuerDID,
                    templateName: certificate.templateName,
                    certificateName: certificate.certificateName,
                    userDID: certificate.userDID
                }
            ).then(res=>{
                var FileSaver = require('file-saver');
                console.log(res.data);
                let info = credential;
                info.certificateSignature = res.data[0];
                info.issuerNonce = res.data[1];
                let content = JSON.stringify(info);
                console.log(content);
                let blob = new Blob([content], {type: "text/plain;charset=utf-8"});
                FileSaver.saveAs(blob, "credential.txt");
            })
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
            <Contex.Provider value={{
                savepath, setSavepath, diddoc,
                templateinfo, setTemplateinfo,
                certificate, setCertificate,
                map, setMap
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
                                <SearchFile/>
                            )}
                            {current === 1 && (
                                <SearchTemplate/>
                            )}
                            {current === 2 && (
                                <ShowTemplate/>
                            )}
                            {current === 3 && (
                                <FillTemplate/>
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
                            <Button type="primary" onClick={() => searchtemplate()}>
                                查找模板
                            </Button>
                        )}
                        {current === 2 && (
                            <Button type="primary" onClick={() => next()}>
                                填写属性
                            </Button>
                        )}
                        {current === 3  && (
                            <Button type="primary" onClick={() => createcredential()}>
                                申请签发
                            </Button>
                        )}
                        {current === 4 && (
                            <Button type="primary" onClick={() => done()}>
                                完成
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

export default CreateCredential;

