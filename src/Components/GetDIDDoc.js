import React, {useState, createContext, useContext} from 'react';
import 'antd/dist/antd.min.css';
import '../index.css';
import { Form, Input, Select, Steps, Button, message, Space, Collapse, Result } from 'antd';
import {useNavigate} from "react-router-dom";
import Icon, {
    UserOutlined,
    SolutionOutlined,
    LoadingOutlined,
    SmileOutlined,
    FileDoneOutlined,
    EditOutlined, CheckOutlined
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
        title: '输入DID',
        content: 'First-content',
        icon: <EditOutlined />,
    },
    {
        title: '确认',
        content: 'Second-content',
        icon: <CheckOutlined />,
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

const GetDid = () => {

    const {did ,setDid} = useContext(Contex);
    const [form] = Form.useForm();
    const onFinish = (values) => {
        console.log(values);
        setDid(values);
        console.log(did);
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
            <Form.Item
                name="did"
                label="DID"
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
    )
};

const ShowDid = () => {
    const {diddoc} = useContext(Contex);
    return (
        <Collapse defaultActiveKey={['1']} onChange={callback}>
            <Panel header="标识符(DID)" key="1">
                <p>{diddoc.publicKey[0].id}</p>
            </Panel>
            <Panel header="公钥(Public Key)" key="2">
                <p>{diddoc.publicKey[0].publicKey}</p>
            </Panel>
            <Panel header="密码算法" key="3">
                <p>{diddoc.authentication[0].type}</p>
            </Panel>
        </Collapse>
    )
};


const GetDidDoc = () => {
    const [current, setCurrent] = React.useState(0);
    const naviate = useNavigate();
    const [didpath, setDidpath] = useState('D:/QGH/DID');
    const [diddoc, setDiddoc] = useState({
        weId : '112233445566',
        publicKey : '123456789',
        privateKey : '123456789'
    });
    const [did, setDid] = useState('112233445566')

    const getdiddoc = () => {
        console.log({
            "WeId" : did.did
        })
        axios.post(ip_port + 'getWeIdDocument', {
            "WeId" : did.did
        })
            .then(res =>{
                console.log(res.data);
                setDiddoc(res.data);
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
            <Contex.Provider value={{didpath, setDidpath, diddoc, setDid, did}}>
                <>
                    <Steps current={current}>
                        {steps.map(item => (
                            <Step key={item.title} title={item.title} icon={item.icon}/>
                        ))}
                    </Steps>
                    <div className="steps-content">
                        <div>
                            {current === 0 && (
                                <GetDid />
                            )}
                            {current === 1 && (
                                <ShowDid/>
                            )}
                        </div>
                    </div>
                    <div className="steps-action">
                        {current < steps.length - 1 && (
                            <Button type="primary" onClick={() => getdiddoc()}>
                                获取DID Document
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button type="primary" onClick={() => done()}>
                                确认
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

export default GetDidDoc;

