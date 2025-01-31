'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Button, message, Card } from 'antd';
import { businessApi } from '../../../api/businessApi';
import { BusinessDTO, BusinessPhase, BusinessStatus } from '../../../types/business';
import { useParams, useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const BusinessEdit = () => {
    const [form] = Form.useForm();
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                const data = await businessApi.getBusiness(Number(params.id));
                form.setFieldsValue({
                    ...data,
                    startDate: dayjs(data.startDate),
                    expectedEndDate: dayjs(data.expectedEndDate),
                    actualEndDate: data.actualEndDate ? dayjs(data.actualEndDate) : undefined,
                });
            } catch (error) {
                console.error('Failed to fetch business:', error);
                message.error('获取业务信息失败');
            }
        };

        if (params.id) {
            fetchBusiness();
        }
    }, [params.id, form]);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const businessData: BusinessDTO = {
                ...values,
                startDate: values.startDate.format('YYYY-MM-DD'),
                expectedEndDate: values.expectedEndDate.format('YYYY-MM-DD'),
                actualEndDate: values.actualEndDate?.format('YYYY-MM-DD'),
            };

            if (params.id) {
                await businessApi.updateBusiness(Number(params.id), businessData);
                message.success('更新成功');
            } else {
                await businessApi.createBusiness(businessData);
                message.success('创建成功');
            }
            router.push('/business/list');
        } catch (error) {
            console.error('Failed to save business:', error);
            message.error('保存失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <Card title={params.id ? '编辑业务' : '新建业务'}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        status: BusinessStatus.NORMAL,
                        currentPhase: BusinessPhase.ADVERTISING,
                    }}
                >
                    <Form.Item
                        name="customerId"
                        label="客户"
                        rules={[{ required: true, message: '请选择客户' }]}
                    >
                        <Select placeholder="请选择客户">
                            {/* TODO: 从API获取客户列表 */}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="businessType"
                        label="业务类型"
                        rules={[{ required: true, message: '请输入业务类型' }]}
                    >
                        <Input placeholder="请输入业务类型" />
                    </Form.Item>

                    <Form.Item
                        name="currentPhase"
                        label="当前阶段"
                        rules={[{ required: true, message: '请选择当前阶段' }]}
                    >
                        <Select>
                            {Object.entries(BusinessPhase).map(([key, value]) => (
                                <Select.Option key={key} value={value}>
                                    {value}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="状态"
                        rules={[{ required: true, message: '请选择状态' }]}
                    >
                        <Select>
                            {Object.entries(BusinessStatus).map(([key, value]) => (
                                <Select.Option key={key} value={value}>
                                    {value}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="location"
                        label="地区"
                        rules={[{ required: true, message: '请输入地区' }]}
                    >
                        <Input placeholder="请输入地区" />
                    </Form.Item>

                    <Form.Item
                        name="totalAmount"
                        label="总金额"
                        rules={[{ required: true, message: '请输入总金额' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value!.replace(/\¥\s?|(,*)/g, '')}
                        />
                    </Form.Item>

                    <Form.Item
                        name="startDate"
                        label="开始日期"
                        rules={[{ required: true, message: '请选择开始日期' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="expectedEndDate"
                        label="预计结束日期"
                        rules={[{ required: true, message: '请选择预计结束日期' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="actualEndDate" label="实际结束日期">
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="remark" label="备注">
                        <Input.TextArea rows={4} placeholder="请输入备注" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            保存
                        </Button>
                        <Button className="ml-2" onClick={() => router.back()}>
                            取消
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default BusinessEdit; 