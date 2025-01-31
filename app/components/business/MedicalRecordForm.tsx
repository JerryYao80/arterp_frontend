import React from 'react';
import { Form, Input, DatePicker, Select, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { MedicalRecordDTO } from '../../types/business';
import dayjs from 'dayjs';

interface MedicalRecordFormProps {
    onSubmit: (values: MedicalRecordDTO) => void;
    loading?: boolean;
    recordTypes?: string[];
}

const MedicalRecordForm: React.FC<MedicalRecordFormProps> = ({
    onSubmit,
    loading = false,
    recordTypes = []
}) => {
    const [form] = Form.useForm();

    const handleSubmit = (values: any) => {
        const record: MedicalRecordDTO = {
            ...values,
            checkDate: values.checkDate.format('YYYY-MM-DD'),
            abnormalFlags: values.abnormalFlags || [],
            reportFiles: values.reportFiles?.fileList?.map((file: any) => file.response?.url) || []
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
                abnormalFlags: []
            }}
        >
            <Form.Item
                name="recordType"
                label="记录类型"
                rules={[{ required: true, message: '请选择记录类型' }]}
            >
                <Select placeholder="请选择记录类型">
                    {recordTypes.map(type => (
                        <Select.Option key={type} value={type}>
                            {type}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="hospitalName"
                label="医院名称"
                rules={[{ required: true, message: '请输入医院名称' }]}
            >
                <Input placeholder="请输入医院名称" />
            </Form.Item>

            <Form.Item
                name="doctorName"
                label="医生姓名"
                rules={[{ required: true, message: '请输入医生姓名' }]}
            >
                <Input placeholder="请输入医生姓名" />
            </Form.Item>

            <Form.Item
                name="checkDate"
                label="检查日期"
                rules={[{ required: true, message: '请选择检查日期' }]}
            >
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="reportContent"
                label="报告内容"
                rules={[{ required: true, message: '请输入报告内容' }]}
            >
                <Input.TextArea rows={4} placeholder="请输入报告内容" />
            </Form.Item>

            <Form.Item
                name="reportFiles"
                label="报告文件"
                rules={[{ required: true, message: '请上传报告文件' }]}
            >
                <Upload
                    action="/api/upload"
                    listType="text"
                    multiple
                >
                    <Button icon={<UploadOutlined />}>上传文件</Button>
                </Upload>
            </Form.Item>

            <Form.Item
                name="abnormalFlags"
                label="异常标记"
            >
                <Select
                    mode="tags"
                    placeholder="请输入异常标记"
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item
                name="followUpActions"
                label="后续行动"
            >
                <Input.TextArea rows={4} placeholder="请输入后续行动" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    提交
                </Button>
            </Form.Item>
        </Form>
    );
};

export default MedicalRecordForm; 