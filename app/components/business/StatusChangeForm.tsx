import React from 'react';
import { Form, Select, Input, Switch, Button } from 'antd';
import { BusinessPhase, BusinessStatusRecordDTO } from '../../types/business';

interface StatusChangeFormProps {
    onSubmit: (values: BusinessStatusRecordDTO) => void;
    currentPhase: BusinessPhase;
    loading?: boolean;
}

const StatusChangeForm: React.FC<StatusChangeFormProps> = ({
    onSubmit,
    currentPhase,
    loading = false
}) => {
    const [form] = Form.useForm();

    const handleSubmit = (values: any) => {
        const record: BusinessStatusRecordDTO = {
            ...values,
            previousPhase: currentPhase,
        };
        onSubmit(record);
        form.resetFields();
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
                isAbnormal: false,
            }}
        >
            <Form.Item
                name="currentPhase"
                label="目标阶段"
                rules={[{ required: true, message: '请选择目标阶段' }]}
            >
                <Select>
                    {Object.entries(BusinessPhase).map(([key, value]) => (
                        <Select.Option key={key} value={value} disabled={value === currentPhase}>
                            {value}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="operator"
                label="操作人"
                rules={[{ required: true, message: '请输入操作人' }]}
            >
                <Input placeholder="请输入操作人" />
            </Form.Item>

            <Form.Item name="isAbnormal" label="是否异常" valuePropName="checked">
                <Switch />
            </Form.Item>

            <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                    prevValues.isAbnormal !== currentValues.isAbnormal
                }
            >
                {({ getFieldValue }) =>
                    getFieldValue('isAbnormal') ? (
                        <>
                            <Form.Item
                                name="abnormalReason"
                                label="异常原因"
                                rules={[{ required: true, message: '请输入异常原因' }]}
                            >
                                <Input.TextArea rows={3} placeholder="请输入异常原因" />
                            </Form.Item>

                            <Form.Item
                                name="solution"
                                label="解决方案"
                                rules={[{ required: true, message: '请输入解决方案' }]}
                            >
                                <Input.TextArea rows={3} placeholder="请输入解决方案" />
                            </Form.Item>
                        </>
                    ) : null
                }
            </Form.Item>

            <Form.Item name="remark" label="备注">
                <Input.TextArea rows={3} placeholder="请输入备注" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    提交
                </Button>
            </Form.Item>
        </Form>
    );
};

export default StatusChangeForm; 