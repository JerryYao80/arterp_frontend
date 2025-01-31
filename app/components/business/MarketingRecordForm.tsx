import React from 'react';
import { Form, Input, InputNumber, DatePicker, Select, Button } from 'antd';
import { MarketingRecordDTO } from '../../types/business';
import dayjs from 'dayjs';

interface MarketingRecordFormProps {
    onSubmit: (values: MarketingRecordDTO) => void;
    loading?: boolean;
    customers?: Array<{ id: number; name: string }>;
}

const MarketingRecordForm: React.FC<MarketingRecordFormProps> = ({
    onSubmit,
    loading = false,
    customers = []
}) => {
    const [form] = Form.useForm();

    const handleSubmit = (values: any) => {
        const record: MarketingRecordDTO = {
            ...values,
            effectiveDate: values.effectiveDate.format('YYYY-MM-DD'),
        };
        onSubmit(record);
        form.resetFields();
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
        >
            <Form.Item
                name="channel"
                label="营销渠道"
                rules={[{ required: true, message: '请输入营销渠道' }]}
            >
                <Input placeholder="请输入营销渠道" />
            </Form.Item>

            <Form.Item
                name="cost"
                label="费用"
                rules={[{ required: true, message: '请输入费用' }]}
            >
                <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value!.replace(/\¥\s?|(,*)/g, '')}
                />
            </Form.Item>

            <Form.Item
                name="conversionSource"
                label="转化来源"
                rules={[{ required: true, message: '请输入转化来源' }]}
            >
                <Input placeholder="请输入转化来源" />
            </Form.Item>

            <Form.Item
                name="referralCustomerId"
                label="推荐客户"
            >
                <Select
                    allowClear
                    placeholder="请选择推荐客户"
                    options={customers.map(customer => ({
                        label: customer.name,
                        value: customer.id
                    }))}
                />
            </Form.Item>

            <Form.Item
                name="marketingContent"
                label="营销内容"
                rules={[{ required: true, message: '请输入营销内容' }]}
            >
                <Input.TextArea rows={4} placeholder="请输入营销内容" />
            </Form.Item>

            <Form.Item
                name="effectiveDate"
                label="生效日期"
                rules={[{ required: true, message: '请选择生效日期' }]}
            >
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    提交
                </Button>
            </Form.Item>
        </Form>
    );
};

export default MarketingRecordForm; 