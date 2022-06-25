import React from 'react';
import 'antd/dist/antd.css';
import { Carousel, Image } from 'antd';
import { Statistic, Row, Col, Button } from 'antd';

const contentStyle = {
    height: '500px',
    color: '#fff',
    lineHeight: '500px',
    textAlign: 'center',
    background: '#364d79',
};

const Pic = () => (
    <div>
        <Carousel autoplay>
            <div>
                {/*<h3 style={contentStyle}>1</h3>*/}
                {/* eslint-disable-next-line no-octal-escape */}
                <Image src={require('../img/2.jpg')}
                />
            </div>
            <div>
                <Image src={require('../img/2.jpg')}
                />
            </div>
            <div>
                <h3 style={contentStyle}>3</h3>
            </div>
            <div>
                <h3 style={contentStyle}>4</h3>
            </div>
        </Carousel>
        <div >
            <Row gutter={20}>
                <Col span={8}>
                    <Statistic title="入网用户" value={114453} />
                    <Button style={{ marginTop: 16 }} type="primary">
                        更新
                    </Button>
                </Col>
                <Col span={8}>
                    <Statistic title="已签发匿名凭证数量" value={843785}/>
                    <Button style={{ marginTop: 16 }} type="primary">
                        更新
                    </Button>
                </Col>
                <Col span={8}>
                    <Statistic title="已节约隐私保护成本 (CNY)" value={5289325} precision={2} />
                    <Button style={{ marginTop: 16 }} type="primary">
                        更新
                    </Button>
                </Col>

            </Row>
        </div>
    </div>

);

export default Pic;