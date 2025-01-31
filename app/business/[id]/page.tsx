'use client';

import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Timeline, Tag, Row, Col, Table, Button, Modal, message } from 'antd';
import { businessApi } from '../../../api/businessApi';
import { BusinessDTO, BusinessPhase, BusinessStatus, BusinessStatusRecordDTO, MarketingRecordDTO, MedicalRecordDTO } from '../../../types/business';
import { useParams, useRouter } from 'next/navigation';

const BusinessDetail = () => {
    const params = useParams();
    const router = useRouter();
    const [business, setBusiness] = useState<BusinessDTO | null>(null);
    const [statusRecords, setStatusRecords] = useState<BusinessStatusRecordDTO[]>([]);
    const [marketingRecords, setMarketingRecords] = useState<MarketingRecordDTO[]>([]);
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecordDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const businessId = Number(params.id);
                const [businessData, statusData, marketingData, medicalData] = await Promise.all([
                    businessApi.getBusiness(businessId),
                    businessApi.getBusinessStatusRecords(businessId),
                    businessApi.getMarketingRecords(businessId),
                    businessApi.getMedicalRecords(businessId)
                ]);

                setBusiness(businessData);
                setStatusRecords(statusData);
                setMarketingRecords(marketingData);
                setMedicalRecords(medicalData);
            } catch (error) {
                console.error('Failed to fetch business details:', error);
                message.error('获取业务详情失败');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    if (loading || !business) {
        return <div>Loading...</div>;
    }

    const getPhaseColor = (phase: BusinessPhase) => {
        const colors: Record<BusinessPhase, string> = {
            [BusinessPhase.ADVERTISING]: 'blue',
            [BusinessPhase.OFFLINE_CONTACT]: 'cyan',
            [BusinessPhase.REFERRAL]: 'geekblue',
            [BusinessPhase.PACKAGE_DESIGN]: 'purple',
            [BusinessPhase.CONTRACT_SIGNING]: 'magenta',
            [BusinessPhase.IVF]: 'red',
            [BusinessPhase.EMBRYO_TRANSFER]: 'volcano',
            [BusinessPhase.PREGNANCY_CARE]: 'orange',
            [BusinessPhase.DELIVERY]: 'gold',
            [BusinessPhase.PATERNITY_TEST]: 'lime',
            [BusinessPhase.OVERSEAS_CARE]: 'green',
            [BusinessPhase.IMMIGRATION_SETTLEMENT]: 'cyan'
        };
        return colors[phase] || 'default';
    };

    return (
        <div className="p-6">
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card
                        title="业务基本信息"
                        extra={
                            <Button type="primary" onClick={() => router.push(`/business/edit/${business.id}`)}>
                                编辑
                            </Button>
                        }
                    >
                        <Descriptions bordered>
                            <Descriptions.Item label="客户名称">{business.customerName}</Descriptions.Item>
                            <Descriptions.Item label="业务类型">{business.businessType}</Descriptions.Item>
                            <Descriptions.Item label="当前阶段">
                                <Tag color={getPhaseColor(business.currentPhase)}>{business.currentPhase}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="状态">
                                <Tag color={business.status === BusinessStatus.NORMAL ? 'green' : 'red'}>
                                    {business.status}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="地区">{business.location}</Descriptions.Item>
                            <Descriptions.Item label="总金额">¥{business.totalAmount.toLocaleString()}</Descriptions.Item>
                            <Descriptions.Item label="开始日期">{new Date(business.startDate).toLocaleDateString()}</Descriptions.Item>
                            <Descriptions.Item label="预计结束日期">{new Date(business.expectedEndDate).toLocaleDateString()}</Descriptions.Item>
                            {business.actualEndDate && (
                                <Descriptions.Item label="实际结束日期">
                                    {new Date(business.actualEndDate).toLocaleDateString()}
                                </Descriptions.Item>
                            )}
                            {business.remark && (
                                <Descriptions.Item label="备注" span={3}>
                                    {business.remark}
                                </Descriptions.Item>
                            )}
                        </Descriptions>
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="状态变更记录">
                        <Timeline
                            items={statusRecords.map(record => ({
                                color: record.isAbnormal ? 'red' : 'blue',
                                children: (
                                    <div key={record.id}>
                                        <p>
                                            {record.previousPhase} → {record.currentPhase}
                                            {record.isAbnormal && <Tag color="red" className="ml-2">异常</Tag>}
                                        </p>
                                        <p className="text-gray-500">操作人: {record.operator}</p>
                                        {record.remark && <p className="text-gray-500">备注: {record.remark}</p>}
                                        {record.isAbnormal && (
                                            <>
                                                <p className="text-red-500">异常原因: {record.abnormalReason}</p>
                                                <p className="text-green-500">解决方案: {record.solution}</p>
                                            </>
                                        )}
                                        <p className="text-gray-400">{new Date(record.createdAt!).toLocaleString()}</p>
                                    </div>
                                ),
                            }))}
                        />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="营销记录">
                        <Table
                            dataSource={marketingRecords}
                            columns={[
                                {
                                    title: '渠道',
                                    dataIndex: 'channel',
                                    key: 'channel',
                                },
                                {
                                    title: '费用',
                                    dataIndex: 'cost',
                                    key: 'cost',
                                    render: (cost: number) => `¥${cost.toLocaleString()}`,
                                },
                                {
                                    title: '转化来源',
                                    dataIndex: 'conversionSource',
                                    key: 'conversionSource',
                                },
                                {
                                    title: '生效日期',
                                    dataIndex: 'effectiveDate',
                                    key: 'effectiveDate',
                                    render: (date: string) => new Date(date).toLocaleDateString(),
                                },
                            ]}
                            rowKey="id"
                            pagination={false}
                            scroll={{ y: 240 }}
                        />
                    </Card>
                </Col>

                <Col span={24}>
                    <Card title="医疗记录">
                        <Table
                            dataSource={medicalRecords}
                            columns={[
                                {
                                    title: '记录类型',
                                    dataIndex: 'recordType',
                                    key: 'recordType',
                                },
                                {
                                    title: '医院',
                                    dataIndex: 'hospitalName',
                                    key: 'hospitalName',
                                },
                                {
                                    title: '医生',
                                    dataIndex: 'doctorName',
                                    key: 'doctorName',
                                },
                                {
                                    title: '检查日期',
                                    dataIndex: 'checkDate',
                                    key: 'checkDate',
                                    render: (date: string) => new Date(date).toLocaleDateString(),
                                },
                                {
                                    title: '异常标记',
                                    dataIndex: 'abnormalFlags',
                                    key: 'abnormalFlags',
                                    render: (flags: string[]) => flags.map(flag => (
                                        <Tag color="red" key={flag}>{flag}</Tag>
                                    )),
                                },
                                {
                                    title: '操作',
                                    key: 'action',
                                    render: (_, record: MedicalRecordDTO) => (
                                        <Button type="link" onClick={() => window.open(record.reportFiles[0])}>
                                            查看报告
                                        </Button>
                                    ),
                                },
                            ]}
                            rowKey="id"
                            expandable={{
                                expandedRowRender: (record) => (
                                    <div>
                                        <p>报告内容：{record.reportContent}</p>
                                        {record.followUpActions && <p>后续行动：{record.followUpActions}</p>}
                                    </div>
                                ),
                            }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default BusinessDetail; 