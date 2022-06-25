import React, {useState, createContext, useContext} from 'react';
import 'antd/dist/antd.min.css';
import '../index.css';
import { Form, Input, Select, Steps, Button, message, Space, Collapse, Result } from 'antd';
import {useNavigate} from "react-router-dom";
import {
    MinusCircleOutlined, PlusOutlined, FileMarkdownOutlined, FileTextOutlined, FileProtectOutlined
} from '@ant-design/icons';
import axios from "axios";
import Helmet from 'react-helmet'

const Contex = createContext(undefined);

const ip_port = "http://139.159.141.28:8080/";

const { Step } = Steps;

const steps = [
    {
        title: '填写模板基本信息',
        content: 'First-content',
        icon: <FileMarkdownOutlined />,
    },
    {
        title: '填写模板属性名',
        content: 'Second-content',
        icon: <FileTextOutlined />,
    },
    {
        title: '生成模板',
        content: 'Last-content',
        icon: <FileProtectOutlined />,
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

const Info = () => {
    const {templateName, setTemplateName,
        description, setDescription,
        issurDid, setIssurDid} = useContext(Contex);

    const onFinish = (values) => {
        console.log(values);
        setTemplateName(values.template_name);
        setIssurDid(values.issurDID);
        setDescription(values.description);
        console.log(templateName);
        console.log(issurDid);
        console.log(description);
    };

    return (
        <>
            <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                <Form.Item
                    name={'issurDID'}
                    label="DID标识符"
                    rules={[
                        {
                            required: true,
                        },
                    ]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name={'template_name'}
                    label="模板名称"
                    rules={[
                        {
                            required: true,
                        },
                    ]}>
                    <Input />
                </Form.Item>
                <Form.Item name={'description'} label="模板描述">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

const Schema = () => {
    const {templateName, description, issurDid, setTemplate} = useContext(Contex);

    const onFinish = values => {
        console.log(values);
        console.log(values.schema)
        let template = {
            schema: values.schema,
            templateName,
            description,
            issuerDID:issurDid
        }
        console.log(template);
        setTemplate(template);
    };

    return (
        <Form
            name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
            <Form.List name="schema">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8}}  align="baseline">
                                <Form.Item
                                    {...restField}
                                    name={name}
                                    rules={[{ required: true, message: '属性名缺失' }]}
                                >
                                    <Input placeholder="属性名" />
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                添加属性
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    提交
                </Button>
            </Form.Item>
        </Form>
    );
};


const Success = () => {
    let text = "模板创建成功!";
    return (
        <Result
            status="success"
            title={text}
        />
    )
};

const CreateSchema = () => {
    const [current, setCurrent] = React.useState(0);
    const naviate = useNavigate();
    const [didpath, setDidpath] = useState('D:/QGH/DID');
    const [diddoc, setDiddoc] = useState({
        weId : '112233445566',
        publicKey : '123456789',
        privateKey : '123456789'
    });
    const [templateName, setTemplateName] = useState('xxxix');
    const [description, setDescription] = useState('xxxix');
    const [issurDid, setIssurDid] = useState('112233445566778899');
    const [template, setTemplate] = useState(undefined)



    const create_schema = () => {
        console.log(template);
        axios.post(ip_port + 'createTemplate', template)
            .then(res => {
                console.log(res.data);
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
                value={{didpath, setDidpath, diddoc,
                    templateName, setTemplateName,
                    description, setDescription,
                    issurDid, setIssurDid,
                    setTemplate, template
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
                                <Info />
                            )}
                            {current === 1 && (
                                <Schema />
                            )}
                            {current === 2 && (
                                <Success />
                            )}
                        </div>
                    </div>
                    <div className="steps-action">
                        {current < steps.length - 2 && (
                            <Button type="primary" onClick={() => next()}>
                                下一步
                            </Button>
                        )}
                        {current < steps.length - 1 && current >= steps.length - 2 && (
                            <Button type="primary" onClick={() => create_schema()}>
                                下一步
                            </Button>
                        )}
                        {current === steps.length - 1 && (
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

export default CreateSchema;

