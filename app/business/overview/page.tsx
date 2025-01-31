'use client';

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { businessApi } from '../../api/businessApi';
import { BusinessPhase } from '../../types/business';
import { Bar, Pie } from '@ant-design/charts';

const BusinessOverview = () => {
    const [phaseData, setPhaseData] = useState<{ phase: string; count: number }[]>([]);
    const [locationData, setLocationData] = useState<{ location: string; count: number }[]>([]);
    const [typeData, setTypeData] = useState<{ type: string; count: number }[]>([]);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 获取各阶段统计
                const phaseStats = await businessApi.getPhaseStatistics();
                const phaseArray = Object.entries(phaseStats).map(([phase, count]) => ({
                    phase: BusinessPhase[phase as keyof typeof BusinessPhase],
                    count: count as number
                }));
                setPhaseData(phaseArray);
                setTotalCount(phaseArray.reduce((acc, curr) => acc + curr.count, 0));

                // 获取地区统计
                const locationStats = await businessApi.getLocationStatistics();
                setLocationData(Object.entries(locationStats).map(([location, count]) => ({
                    location,
                    count: count as number
                })));

                // 获取类型统计
                const typeStats = await businessApi.getTypeStatistics();
                setTypeData(Object.entries(typeStats).map(([type, count]) => ({
                    type,
                    count: count as number
                })));
            } catch (error) {
                console.error('Failed to fetch statistics:', error);
            }
        };

        fetchData();
    }, []);

    const phaseConfig = {
        data: phaseData,
        xField: 'phase',
        yField: 'count',
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        meta: {
            phase: { alias: '业务阶段' },
            count: { alias: '数量' },
        },
    };

    const locationConfig = {
        data: locationData,
        angleField: 'count',
        colorField: 'location',
        radius: 0.8,
        label: {
            type: 'outer',
            content: '{name} {percentage}',
        },
        meta: {
            location: { alias: '地区' },
            count: { alias: '数量' },
        },
    };

    const typeConfig = {
        data: typeData,
        angleField: 'count',
        colorField: 'type',
        radius: 0.8,
        label: {
            type: 'outer',
            content: '{name} {percentage}',
        },
        meta: {
            type: { alias: '业务类型' },
            count: { alias: '数量' },
        },
    };

    return (
        <div className="p-6">
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card title="业务总览">
                        <Statistic title="总业务数量" value={totalCount} />
                    </Card>
                </Col>
                
                <Col span={24}>
                    <Card title="各阶段业务数量统计">
                        <Bar {...phaseConfig} />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="业务地区分布">
                        <Pie {...locationConfig} />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="业务类型分布">
                        <Pie {...typeConfig} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default BusinessOverview; 