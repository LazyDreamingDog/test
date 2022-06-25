import React, {useState, createContext, useContext} from 'react';
import 'antd/dist/antd.min.css';
import '../index.css';
import { Form, Input, Select, Steps, Button, message, Collapse, Result } from 'antd';
import {useNavigate} from "react-router-dom";
import { LoadingOutlined, SmileOutlined, FolderOpenOutlined } from '@ant-design/icons';
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
        title: '生成DID',
        content: 'Second-content',
        icon: <LoadingOutlined />,
    },
    {
        title: '生成成功',
        content: 'Last-content',
        icon: <SmileOutlined />,
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
    const {didpath, setDidpath} = useContext(Contex);
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
        setDidpath(values.path);
        console.log(didpath);
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

const Did = () => {
    const {diddoc} = useContext(Contex);
    return (
        <Collapse defaultActiveKey={['1']} onChange={callback}>
            <Panel header="标识符(DID)" key="1">
                <p>{diddoc.weId}</p>
            </Panel>
            <Panel header="公钥(Public Key)" key="2">
                <p>{diddoc.publicKey}</p>
            </Panel>
            <Panel header="私钥(Private Key)" key="3">
                <p>{diddoc.privateKey}</p>
            </Panel>
        </Collapse>
    )
};

const Success = () => {
    const {didpath} = useContext(Contex);
    let text = "DID文件保存成功!";
    let text_path = "存储路径为:" + didpath;
    return (
        <Result
            status="success"
            title={text}
            subTitle={text_path}
        />
    )
};

const CreateDid = () => {
    const [current, setCurrent] = React.useState(0);
    const naviate = useNavigate();
    const [didpath, setDidpath] = useState('D:/QGH/DID');
    const [diddoc, setDiddoc] = useState({
        weId : '112233445566',
        publicKey : '123456789',
        privateKey : '123456789'
    });

    const createdid = () => {
        axios.get(ip_port + 'createWeId', {})
            .then(res => {
                console.log(res.data);
                setDiddoc(res.data);
                setCurrent(current + 1);
            });
    };

    const savedid = () => {
        var FileSaver = require('file-saver');

        let content = JSON.stringify(diddoc);
        console.log(content);
        let blob = new Blob([content], {type: "text/plain;charset=utf-8"});
        console.log(didpath);
        FileSaver.saveAs(blob, "1.txt");

        setCurrent(current + 1);
    }

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
            <Contex.Provider value={{didpath, setDidpath, diddoc}}>
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
                                <Did />
                            )}
                            {current === 2 && (
                                <Success />
                            )}
                        </div>
                    </div>
                    <div className="steps-action">
                        {current < steps.length - 2 && (
                            <Button type="primary" onClick={() => createdid()}>
                                生成DID
                            </Button>
                        )}
                        {current < steps.length - 1 && current >= steps.length - 2 && (
                            <Button type="primary" onClick={() => savedid()}>
                                确认
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

export default CreateDid;

