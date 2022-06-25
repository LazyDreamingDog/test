import React, {useState, createContext, useContext} from 'react';
import 'antd/dist/antd.min.css';
import '../index.css';
import {
    Form, Input, Select, Steps, Button,
    message, Upload, Collapse, Result,
    Card, Radio, Popover, Descriptions
} from 'antd';
import {useNavigate} from "react-router-dom";
import {
    UserOutlined,
    SolutionOutlined,
    LoadingOutlined,
    SmileOutlined,
    FileDoneOutlined,
    MinusCircleOutlined, PlusOutlined,
    InboxOutlined, FormOutlined, SwitcherOutlined, CloudUploadOutlined
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
        title: '填写基本信息',
        content: 'First-content',
        icon: <FormOutlined />,
    },
    {
        title: '确认模板',
        content: 'Second-content',
        icon: <FileDoneOutlined />,
    },
    {
        title: '选择属性',
        content: 'Last-content',
        icon: <SwitcherOutlined />,
    },
    {
        title: '填写属性验证规则',
        content: 'Last-content',
        icon: <SolutionOutlined />,
    },
    {
        title: '提交验证规则',
        content: 'Last-content',
        icon: <CloudUploadOutlined />,
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

const SearchTemplate = () => {

    const [form] = Form.useForm();
    const {
        templateName, setTemplateName,
        description, setDescription,
        issuerDID, setIssuerDID,
        ruleName, setRuleName,
        templateinfo, setTemplateinfo
    } = useContext(Contex);

    const onFinish = (values) => {
        console.log(values);
        setIssuerDID(values.issuerdid);
        setTemplateName(values.templatename);
        setRuleName(values.rulename);
        setDescription(values.des);
        console.log(issuerDID);
        console.log(templateName);
        console.log(ruleName);
        console.log(description);
        console.log({
            "issuerDID": issuerDID,
            "templateName": templateName
        });
        axios.post(ip_port + 'getTemplateView', {
            "issuerDID": issuerDID,
            "templateName": templateName
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
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish} validateMessages={validateMessages}>
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
                name={"rulename"}
                label="规则名"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name={"des"}
                label="规则描述"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input.TextArea />
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
}

const ShowTemplateInCVR = () => {
    const {templateinfo} = useContext(Contex)
    return (
        <>
            <Card title="模板" >
                {templateinfo.schema.map((item, index)=>(
                    <Card
                        style={{
                            marginTop: 16,
                        }}
                        type="inner"
                        title="所需属性"
                        key={index}
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

const SearchAttributes = () => {
    const {
        templateinfo,
        revealedAttributes, setRevealedAttributes,
        arrpredicates, setArrpredicates
    } = useContext(Contex);
    const [form] = Form.useForm();

    const content1 = (
        <div>
            <p>该属性是凭证验证必须的属性</p>
            <p>凭证验证时将对该属性进行断言证明</p>
            <p>后续须要填写该属性断言证明的要求</p>
        </div>
    );

    const content2 = (
        <div>
            <p>该属性是必须展示但不参与验证的属性</p>
            <p>因该属性是验证非必要属性</p>
            <p>请慎重考虑是否要求用户出示此属性</p>
        </div>
    );

    const content3 = (
        <div>
            <p>该属性是不需要的属性</p>
            <p>用户的验证请求中将不会出现任何与该属性有关的信息</p>
        </div>
    );

    const onFinish = (values) => {
        console.log(values);
        let arr_predicates = [];
        let arr_revealedAttributes = [];
        Object.keys(values).forEach(function(key) {
            if(values[key]==='predicates')
            {
                arr_predicates.push(key);
            }
            if(values[key]==='revealed')
            {
                arr_revealedAttributes.push(key);
            }
        });
        console.log(arr_predicates);
        console.log(arr_revealedAttributes);
        setArrpredicates(arr_predicates);
        setRevealedAttributes(arr_revealedAttributes);
        console.log(arrpredicates);
        console.log(revealedAttributes);
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish} validateMessages={validateMessages}>
            {templateinfo.schema.map((item, index)=>(
                <Card title={"属性名: " + item} key={index}>
                    <Form.Item name={item} label="选择属性需求"
                               rules={[
                                   {
                                       required: true,
                                   },
                               ]}
                               key={index}>
                        <Radio.Group key={index}>
                            <Popover placement="topLeft" title="须证明属性"
                                     content={content1} trigger="hover">
                                <Radio value="predicates">须证明属性</Radio>
                            </Popover>
                            <Popover placement="top" title="须披露属性"
                                     content={content2} trigger="hover">
                                <Radio value="revealed">须披露属性</Radio>
                            </Popover>
                            <Popover placement="topRight" title="非必要属性"
                                     content={content3} trigger="hover">
                                <Radio value="unnecessary">非必要属性</Radio>
                            </Popover>
                        </Radio.Group>
                    </Form.Item>
                </Card>
            ))}
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

const FillAttributeQuest = () => {
    const {
        rule, setRule,
        revealedAttributes,
        arrpredicates,
        description,
        templateName,
        issuerDID,
        ruleName,
    } = useContext(Contex);
    const [form] = Form.useForm();


    const onFinish = (values) => {
        console.log(values);
        let arr = [];
        Object.keys(values).forEach(function(key) {
            arr.push(values[key]);
        });
        console.log(arr);
        console.log(arr.length);
        let predicates_list = [];
        let num = (arr.length)/2;
        console.log(num);
        for(let i=0;i<num;i++)
        {
            let p = {
                attributeName: arrpredicates[i],
                comparison: arr[i * 2],
                threshold: arr[i*2+1]
            };
            predicates_list.push(p);
        }
        console.log(predicates_list);
        let rules = {
            issuerDID: issuerDID,
            templateName: templateName,
            ruleName: ruleName,
            description: description,
            predicates: predicates_list,
            revealedAttributes: revealedAttributes
        };
        console.log(rules);
        setRule(rules);
        console.log(rule);
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
            {arrpredicates.map((item, index)=>(
                <Card title={"属性名: " + item} key={index}>
                    <Form.Item
                        name={"comparison_of_" + item }
                        label="比较符"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            placeholder="选择该属性的比较符"
                            allowClear
                        >
                            <Option value=">">{">"}</Option>
                            <Option value=">=">{">="}</Option>
                            <Option value="==">{"=="}</Option>
                            <Option value="<=">{"<="}</Option>
                            <Option value="<">{"<"}</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name={"threshold_of_" + item }
                        label="阈值"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Card>
            ))}
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
    let text = "创建成功!";
    return (
        <Result
            status="success"
            title={text}
        />
    )
};

const CreateVerifyRules = () => {
    const [current, setCurrent] = React.useState(0);
    const naviate = useNavigate();
    const [templateName, setTemplateName] = useState('xxxix');
    const [description, setDescription] = useState("This text is a description of the verify rules");
    const [issuerDID, setIssuerDID] = useState('112233445566778899');
    const [ruleName, setRuleName] = useState('check out for WanHao');
    const [templateinfo, setTemplateinfo] = useState({
        schema: [
            'age',
            'gender'
        ],
        templateName: 'xxxix',
        description: 'xxxix',
        issuerDID: 'xxxix'
    })
    const [arrpredicates, setArrpredicates] = useState([
        "gander"
    ])
    const [predicates, setPredicates] = useState(
        [
            {
                attributeName: "gander",
                comparison: "==" ,
                threshold: "male"
            }
        ]
    );
    const [revealedAttributes, setRevealedAttributes] = useState(
        [
            "school",
            "name"]
    )

    const [rule, setRule] = useState(undefined);

    const createverifyrules = () => {
        console.log(rule);
        axios.post(ip_port + 'createVerifyRule', rule
        ).then(res=>{
            console.log(res.data);
            var FileSaver = require('file-saver');
            let content = JSON.stringify(res.data);
            console.log(content);
            let blob = new Blob([content], {type: "text/plain;charset=utf-8"});
            console.log(res.data);
            FileSaver.saveAs(blob, "rules.txt");
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
                    templateName, setTemplateName,
                    description, setDescription,
                    issuerDID, setIssuerDID,
                    ruleName, setRuleName,
                    templateinfo, setTemplateinfo,
                    rule, setRule,
                    predicates, setPredicates,
                    revealedAttributes, setRevealedAttributes,
                    arrpredicates, setArrpredicates
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
                                <SearchTemplate/>
                            )}
                            {current === 1 && (
                                <ShowTemplateInCVR/>
                            )}
                            {current === 2 && (
                                <SearchAttributes/>
                            )}
                            {current === 3 && (
                                <FillAttributeQuest/>
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
                            <Button type="primary" onClick={() => next()}>
                                下一步
                            </Button>
                        )}
                        {current === 3 && (
                            <Button type="primary" onClick={() => createverifyrules()}>
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

export default CreateVerifyRules;

