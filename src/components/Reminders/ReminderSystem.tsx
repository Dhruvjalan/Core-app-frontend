// // components/Reminders/ReminderSystem.jsx
// import { useState, useEffect } from 'react';
// import { Button, List, Modal, Form, Input, DatePicker } from 'antd';
// import { sendEmail } from '../../utils/emailHandler';

// const { TextArea } = Input;

// export default function ReminderSystem({ company, poc }) {
//   const [reminders, setReminders] = useState([]);
//   const [showReminderModal, setShowReminderModal] = useState(false);
//   const [form] = Form.useForm();

//   useEffect(() => {
//     // Load saved reminders from localStorage or API
//     const savedReminders = JSON.parse(localStorage.getItem('reminders') || '[]');
//     setReminders(savedReminders.filter(r => 
//       r.companyId === company?._id && r.pocId === poc?._id
//     ));
//   }, [company, poc]);

//   const scheduleReminder = async (values) => {
//     const newReminder = {
//       id: Date.now(),
//       companyId: company._id,
//       pocId: poc._id,
//       ...values,
//       scheduledFor: values.date.valueOf(),
//       status: 'scheduled'
//     };

//     const updatedReminders = [...reminders, newReminder];
//     setReminders(updatedReminders);
//     localStorage.setItem('reminders', JSON.stringify(updatedReminders));
    
//     // Set timeout to send email
//     const now = Date.now();
//     const delay = newReminder.scheduledFor - now;
    
//     if (delay > 0) {
//       setTimeout(async () => {
//         // change sending email here
//         try {
//           await sendEmail(
//             "dhruvjalan0202@gmail.com",
//             `Reminder: ${newReminder.subject}`,
//             newReminder.message
//           );
//           // Update reminder status
//           const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
//           const updated = reminders.map(r => 
//             r.id === newReminder.id ? {...r, status: 'sent'} : r
//           );
//           localStorage.setItem('reminders', JSON.stringify(updated));
//           setReminders(updated.filter(r => 
//             r.companyId === company._id && r.pocId === poc._id
//           ));
//         } catch (error) {
//           console.error('Failed to send reminder:', error);
//         }
//       }, delay);
//     }

//     setShowReminderModal(false);
//     form.resetFields();
//   };

//   return (
//     <div>
//       <Button 
//         type="primary" 
//         onClick={() => setShowReminderModal(true)}
//         style={{ marginBottom: 16 }}
//       >
//         Schedule Reminder
//       </Button>

//       <List
//         dataSource={reminders}
//         renderItem={reminder => (
//           <List.Item>
//             <div>
//               <strong>{reminder.subject}</strong>
//               <br />
//               <span>Scheduled for: {new Date(reminder.scheduledFor).toLocaleString()}</span>
//               <br />
//               <span>Status: {reminder.status}</span>
//             </div>
//           </List.Item>
//         )}
//       />

//       <Modal
//         title="Schedule Reminder"
//         open={showReminderModal}
//         onCancel={() => setShowReminderModal(false)}
//         footer={null}
//       >
//         <Form form={form} onFinish={scheduleReminder} layout="vertical">
//           <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>
          
//           <Form.Item name="message" label="Message" rules={[{ required: true }]}>
//             <TextArea rows={4} />
//           </Form.Item>
          
//           <Form.Item name="date" label="Schedule For" rules={[{ required: true }]}>
//             <DatePicker showTime />
//           </Form.Item>
          
//           <Button type="primary" htmlType="submit">
//             Schedule
//           </Button>
//         </Form>
//       </Modal>
//     </div>
//   );
// }