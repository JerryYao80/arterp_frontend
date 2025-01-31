'use client';

import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Space, Tag, Modal, message } from 'antd';
import { businessApi } from '../../api/businessApi';
import { BusinessDTO, BusinessPhase, BusinessStatus } from '../../types/business';
import { useRouter } from 'next/navigation';

const BusinessList = () => {
    const [businesses, setBusinesses] = useState<BusinessDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fetchBusinesses = async () => {
        setLoading(true);
        try {
            const data = await businessApi.getBusinessesByStatus(BusinessStatus.NORMAL);
            setBusinesses(data);
        } catch (error) {
            console.error('Failed to fetch businesses:', error);
            message.error('获取业务列表失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const handleDelete = async (id: number) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这个业务吗？',
            onOk: async () => {
                try {
                    await businessApi.deleteBusiness(id);
                    message.success('删除成功');
                    fetchBusinesses();
                } catch (error) {
                    console.error('Failed to delete business:', error);
                    message.error('删除失败');
                }
            },
        });
    };

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

    const columns = [
        {
            title: '客户名称',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: '业务类型',
            dataIndex: 'businessType',
            key: 'businessType',
        },
        {
            title: '当前阶段',
            dataIndex: 'currentPhase',
            key: 'currentPhase',
            render: (phase: BusinessPhase) => (
                <Tag color={getPhaseColor(phase)}>{phase}</Tag>
            ),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: BusinessStatus) => (
                <Tag color={status === BusinessStatus.NORMAL ? 'green' : 'red'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: '地区',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: '总金额',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount: number) => `¥${amount.toLocaleString()}`,
        },
        {
            title: '开始日期',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: BusinessDTO) => (
                <Space size="middle">
                    <Button type="link" onClick={() => router.push(`/business/${record.id}`)}>
                        查看
                    </Button>
                    <Button type="link" onClick={() => router.push(`/business/edit/${record.id}`)}>
                        编辑
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record.id!)}>
                        删除
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <Card
                title="业务列表"
                extra={
                    <Button type="primary" onClick={() => router.push('/business/new')}>
                        新建业务
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={businesses}
                    rowKey="id"
                    loading={loading}
                />
            </Card>
        </div>
    );
};

export default BusinessList; 