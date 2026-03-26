// crossroads-frontend\src\components\Mail\EmailAutomationModal.tsx
import React, { useState } from "react";
import { AlertStatus } from "@chakra-ui/react";
import {
	Modal,
	Form,
	Select,
	Button,
	Card,
	Space,
	Typography,
	Divider,
	DatePicker,
	Switch,
	List,
	Avatar,
	Radio,
} from "antd";

import { SendOutlined, CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { scheduleAutomatedEmails } from "../../utils/emailHandler";
import dayjs from "dayjs";

const { Option } = Select;
const { Text, Title } = Typography;

const testReminderDelay = 3;

interface AlertDownProps {
	text: string;
	mode: AlertStatus;
}
interface pocOptionsObject{
	label:string;
	value:string;
}

interface EmailAutomationModalProps {
	visible: boolean;
	onCancel: () => void;
	poc: any;
	drafts: any[];
	setCompanyAlert: React.Dispatch<React.SetStateAction<AlertDownProps>>;
	setShowAlert: React.Dispatch<React.SetStateAction<Boolean>>;
	showAlert: Boolean;
	company: any;
	user_name: string;
	user_email: string;
	access: string;
	pocOptions: pocOptionsObject[];
}

interface ConfirmationItem {
	type: "Welcome" | "Reminder";
	draft: any;
	time: dayjs.Dayjs;
}

const EmailAutomationModal: React.FC<EmailAutomationModalProps> = ({
	visible,
	onCancel,
	poc,
	drafts,
	setCompanyAlert,
	setShowAlert,
	company,
	user_name,
	user_email,
	access,
	pocOptions
}) => {
	const [form] = Form.useForm();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
	const [workingDaysOnly, setWorkingDaysOnly] = useState(true);
	// const [numberOfReminders, setNumberOfReminders] = useState(0);

	const [confirmationVisible, setConfirmationVisible] = useState(false);
	const [confirmationSequence, setConfirmationSequence] = useState<ConfirmationItem[]>([]);

	const reminderFrequency = Form.useWatch("reminderFrequency", form);

	const generateTimeOptions = () => {
		const times = [];
		for (let hour = 9; hour < 18; hour++) {
			for (let minute = 0; minute < 60; minute += 30) {
				const timeString = `${hour.toString().padStart(2, "0")}:${minute
					.toString()
					.padStart(2, "0")}`;
				times.push(timeString);
			}
		}
		times.push("18:00");
		return times;
	};

	const timeOptions = generateTimeOptions();

	const isWorkingDay = (date: dayjs.Dayjs): boolean => {
		const day = date.day(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
		return day !== 0 && day !== 6; // Exclude Sunday (0) and Saturday (6)
	};

	const getNextWorkingDay = (date: dayjs.Dayjs): dayjs.Dayjs => {
		let nextDay = date.add(1, "day");
		while (!isWorkingDay(nextDay)) {
			nextDay = nextDay.add(1, "day");
		}
		return nextDay;
	};

	const addWorkingDays = (date: dayjs.Dayjs, daysToAdd: number): dayjs.Dayjs => {
		let currentDate = date;
		let daysAdded = 0;
		while (daysAdded < daysToAdd) {
			currentDate = currentDate.add(1, "day");
			if (isWorkingDay(currentDate)) {
				daysAdded++;
			}
		}
		return currentDate;
	};

	const calculateTestDateTime = (): dayjs.Dayjs => {
		return dayjs();
	};

	const calculateWelcomeDateTime = (
		selectedDate: dayjs.Dayjs | null,
		selectedTime: string | null,
		workingDaysOnly: boolean
	): dayjs.Dayjs => {
		if (!selectedDate || !selectedTime) {
			return dayjs();
		}

		const [hours, minutes] = selectedTime.split(":").map(Number);
		let scheduledDateTime = selectedDate.hour(hours).minute(minutes).second(0);
		const now = dayjs();

		if (workingDaysOnly && !isWorkingDay(scheduledDateTime)) {
			scheduledDateTime = getNextWorkingDay(scheduledDateTime.startOf("day"))
				.hour(hours)
				.minute(minutes)
				.second(0);
		}

		if (scheduledDateTime.isBefore(now)) {
			let nextAvailable = now.add(5, "minute");
			if (workingDaysOnly) {
				if (!isWorkingDay(nextAvailable)) {
					nextAvailable = getNextWorkingDay(nextAvailable.startOf("day"))
						.hour(hours)
						.minute(minutes)
						.second(0);
				}
			}
			let nextSlotToday = now.add(5, "minute");
			let nextSlotChosenTime = selectedDate.hour(hours).minute(minutes).second(0);

			if (workingDaysOnly && !isWorkingDay(nextSlotChosenTime)) {
				nextSlotChosenTime = getNextWorkingDay(nextSlotChosenTime.startOf("day"))
					.hour(hours)
					.minute(minutes)
					.second(0);
			}

			if (nextSlotChosenTime.isAfter(now)) {
				return nextSlotChosenTime;
			}

			if (workingDaysOnly && !isWorkingDay(nextSlotToday)) {
				nextSlotToday = getNextWorkingDay(nextSlotToday.startOf("day"))
					.hour(9)
					.minute(0)
					.second(0);
			}
			return nextSlotToday;
		}

		return scheduledDateTime;
	};

	const alert = (alertProp: AlertDownProps) => {
		setCompanyAlert(alertProp);
		setShowAlert(true);
		setTimeout(() => setShowAlert(false), 3500);
	};

	const fillInBlank = (content: string) => {
		return content
    .replace(/@pocname/g, poc.name)
    .replace(/@poccompany/g, company.name)
    .replace(/@pocphone/g, poc.phoneNumber)
    .replace(/@pocemail/g, poc.email)
    .replace(/@username/g, user_name)
    .replace(/@useremail/g, user_email)
    .replace(/@useraccess/g, access)
    .replace(/@companysector/g, company.sector);

	};

	const handlePrepareSequence = async (values: any) => {
		setIsSubmitting(true);
		//console.log("Preparing sequence with values:", values, drafts);	
		try {
			let welcomeDraft = drafts.find((d) => {
				
				if(d._id === values.welcomeEmail){
					d.to= values.to? values.to: [];
					d.cc= values.cc? values.cc: [];
					d.bcc= values.bcc? values.bcc: [];
					return true;
				}
				return false;
			});
			let reminderDraft = drafts.find((d) => {
				
				if(d._id === values.reminderEmail){
					d.to= values.to? values.to: [];
					d.cc= values.cc? values.cc: [];
					d.bcc= values.bcc? values.bcc: [];
					return true;
				}
				return false;
			});

			if (!welcomeDraft) {
				throw new Error("Please select a welcome email");
			}
			if (!reminderDraft) {
				throw new Error("Please select a reminder email");
			}

			const isTestMode = values.test === "yes";

			const welcomeDateTime = isTestMode
				? calculateTestDateTime()
				: calculateWelcomeDateTime(
						values.scheduleDate || null,
						values.scheduleTime || null,
						values.workingDaysOnly
				  );

			const sequenceToConfirm: ConfirmationItem[] = [
				{
					type: "Welcome",
					draft: welcomeDraft,
					time: welcomeDateTime,
				},
			];

			setConfirmationVisible(false);
			const numberOfReminders =
				values.reminderFrequency === "none"
					? 0
					: values.reminderFrequency === "single"
					? 1
					: values.reminderFrequency === "twice"
					? 2
					: 3;
			setConfirmationVisible(true);
			let lastEmailDate = welcomeDateTime;

			if (isTestMode) {
				for (let i = 0; i < numberOfReminders; i++) {
					const reminderDateTime = lastEmailDate.add(testReminderDelay, "minute");

					sequenceToConfirm.push({
						type: "Reminder",
						draft: reminderDraft,
						time: reminderDateTime,
					});

					lastEmailDate = reminderDateTime;
				}
			} else {
				if (numberOfReminders > 0 && !values.reminderTime) {
					throw new Error("Please select a time for reminders");
				}

				const repeatIntervalDays = values.repeatInterval;
				const [remHours, remMins] = values.reminderTime
					? values.reminderTime.split(":").map(Number)
					: [9, 0];

				const addDays = values.workingDaysOnly
					? addWorkingDays
					: (date: dayjs.Dayjs, days: number) => date.add(days, "day");

				for (let i = 0; i < numberOfReminders; i++) {
					const reminderDate = addDays(lastEmailDate, repeatIntervalDays);
					const reminderDateTime = reminderDate.hour(remHours).minute(remMins).second(0);

					sequenceToConfirm.push({
						type: "Reminder",
						draft: reminderDraft,
						time: reminderDateTime,
					});

					lastEmailDate = reminderDateTime;
				}
			}

			setConfirmationSequence(sequenceToConfirm);
			//console.log("Set Sequence to:",sequenceToConfirm);
			setConfirmationVisible(true);
		} catch (error: any) {
			alert({
				text: error.message || "Failed to prepare schedule. Please check inputs.",
				mode: "error",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleConfirmSchedule = async () => {
		setIsSubmitting(true);
		try {
			const now = dayjs();

			const emailSequence = confirmationSequence.map((item) => {
				const delayMinutes = Math.max(0, item.time.diff(now, "minute"));

				return {
					draftId: item.draft._id,
					delayMinutes: delayMinutes,
					to: item.draft.to,
					from: user_email,
					subject: item.draft.subject,
					content: fillInBlank(item.draft.content),
					pocId: poc._id,
					scheduledTime: item.time.toISOString(),
					createNewThread: item.type != "Reminder",
					cc: item.draft.cc || [],
					bcc: item.draft.bcc || [],
					attachments: item.draft.attachments || [],
				};
			});
//CONFIRMATION EMAIL THAT REMINDER SENT 


			// emailSequence.push({
			//   draftId: 'user_confirmation',
			//   delayMinutes: 0,
			//   to: user_email,
			//   from: "noreply@ecell-iitm.com",
			//   subject: `Email Sequence Scheduled for ${poc.name}`,
			//   content: `
			//     <p>This is a confirmation that an email sequence has been scheduled for <strong>${poc.name} (${poc.email})</strong>.</p>
			//     <p><strong>Total Emails Scheduled:</strong> ${confirmationSequence.length}</p>
			//     <ul>
			//       ${confirmationSequence.map(item => `
			//         <li>
			//           <strong>${item.type} Email:</strong> "${item.draft.subject}"
			//           <br>
			//           <strong>Scheduled For:</strong> ${item.time.format('dddd, MMMM D, YYYY [at] h:mm A')}
			//         </li>
			//       `).join('')}
			//     </ul>
			//   `,
			//   pocId: poc._id,
			//   scheduledTime: now.toISOString(),
			//   createNewThread: true
			// });
			// console.log(
			// 	"In EmailAutomationModal.tsx. Sending emailsequence to scheduleAutomatedEmails ",
			// 	emailSequence
			// );
			await scheduleAutomatedEmails(emailSequence);

			alert({
				text: `Success! ${confirmationSequence.length} email(s) have been scheduled for ${poc.name}.`,
				mode: "success",
			});

			setConfirmationVisible(false);
			handleCancel();
		} catch (error: any) {
			alert({
				text: error.message || "Failed to schedule emails. Please try again.",
				mode: "error",
			});
			console.error("Error scheduling emails:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		form.resetFields();
		setSelectedDate(null);
		setWorkingDaysOnly(true);
		setConfirmationVisible(false);
		setConfirmationSequence([]);
		onCancel();
	};

	const disabledDate = (current: dayjs.Dayjs) => {
		if (current && current < dayjs().startOf("day")) {
			return true;
		}

		if (workingDaysOnly) {
			return !isWorkingDay(current);
		}

		return false;
	};

	return (
		<>
			<Modal
				title={
					<span style={{ color: "#000000", fontSize: "18px", fontWeight: "600" }}>
						Schedule Automated Email Sequence
					</span>
				}
				open={visible}
				onCancel={handleCancel}
				footer={null}
				width={700}
				style={{ top: 20 }}
			>
				<Text
					style={{
						display: "block",
						marginBottom: 16,
						color: "#666666",
						fontSize: "14px",
					}}
				>
					Set up an automated email sequence for {poc.name} ({poc.email})
				</Text>

				<Form
					form={form}
					layout="vertical"
					onFinish={handlePrepareSequence}
					initialValues={{
						repeatInterval: 2,
						reminderFrequency: "three",
						workingDaysOnly: true,
						test: "no",
					
					}}
				>
					<Card
						style={{ marginBottom: 16, border: "1px solid #d9d9d9" }}
						title={
							<span style={{ color: "#000000", fontSize: "16px", fontWeight: "600" }}>
								Schedule Settings
							</span>
						}
					>
						<Form.Item
							name="test"
							label="Test Mode?"
							rules={[{ required: true, message: "Please select Test or not" }]}
						>
							<Radio.Group>
								<Radio value="no">No (Live Schedule)</Radio>
								<Radio value="yes">Yes (Send immediately)</Radio>
							</Radio.Group>
						</Form.Item>

						<Form.Item
							name="workingDaysOnly"
							label={
								<span style={{ color: "#000000", fontWeight: "500" }}>
									Working Days Only
								</span>
							}
							valuePropName="checked"
							
						>
							<Switch onChange={(checked) => setWorkingDaysOnly(checked)} checkedChildren="Weekdays only" unCheckedChildren="All days" />
						</Form.Item>

						<Form.Item
							name="scheduleDate"
							label={
								<span style={{ color: "#000000", fontWeight: "500" }}>
									Welcome Email Date
								</span>
							}
						>
							<DatePicker
								style={{ width: "100%", border: "1px solid #d9d9d9" }}
								placeholder="Select date (or leave blank for 'immediate')"
								format="YYYY-MM-DD"
								disabledDate={disabledDate}
								onChange={(date) => setSelectedDate(date)}
								suffixIcon={<CalendarOutlined style={{ color: "#000000" }} />}
								className="custom-date-picker"
							/>
						</Form.Item>

						<Form.Item
							name="scheduleTime"
							label={
								<span style={{ color: "#000000", fontWeight: "500" }}>
									Welcome Email Time (9:00 - 18:00)
								</span>
							}
						>
							<Select
								placeholder="Select time"
								disabled={!selectedDate}
								style={{ border: "1px solid #d9d9d9" }}
								styles={{
									popup: { 
										root: { 
											backgroundColor: "#ffffff",
											border: "1px solid #d9d9d9",
										}
									},
								}}
							>
								{timeOptions.map((time) => (
									<Option key={time} value={time}>
										<span style={{ color: "#000000", padding: "8px 12px" }}>
											{time}
										</span>
									</Option>
								))}
							</Select>
						</Form.Item>

						<Text
							style={{
								color: workingDaysOnly ? "#1890ff" : "#666666",
								fontSize: "13px",
							}}
						>
							{workingDaysOnly
								? "✓ Emails will be sent on working days (Monday-Friday) only."
								: "Emails will be sent on all days including weekends."}
						</Text>
					</Card>

					<Card
						style={{ marginBottom: 16, border: "1px solid #d9d9d9" }}
						title={
							<span style={{ color: "#000000", fontSize: "16px", fontWeight: "600" }}>
								Welcome Email
							</span>
						}
					>
						<Form.Item
							name="welcomeEmail"
							label={
								<span style={{ color: "#000000", fontWeight: "500" }}>
									Select Welcome Email
								</span>
							}
							rules={[{ required: true, message: "Please select a welcome email" }]}
						>
							<Select
								placeholder="Choose a welcome email draft"
								style={{ border: "1px solid #d9d9d9" }}
								styles={{
									popup: { 
										root: { 
											backgroundColor: "#ffffff",
											border: "1px solid #d9d9d9",
										}
									},
								}}
							>
								{drafts.map((draft) => (
									<Option key={draft._id} value={draft._id}>
										<span style={{ color: "#000000", padding: "8px 12px" }}>
											{draft.name}
										</span>
									</Option>
								))}
							</Select>
						</Form.Item>
					</Card>

<Card
						style={{ marginBottom: 16, border: "1px solid #d9d9d9" }}
						title={
							<span style={{ color: "#000000", fontSize: "16px", fontWeight: "600" }}>
								Email Sending Settings
							</span>
						}
					>
						<Form.Item name="to" label={
								<span style={{ color: "#000000", fontWeight: "500" }}>
									To Email Ids:
								</span>
							}
							
							rules={[{ required: true, message: "Please select a To email id" }]}>
						<Select
							mode="tags"
							options={pocOptions} // Your POC list goes here
							placeholder="Select POCs or type email and press Enter"
							className="composer-input"
							tokenSeparators={[","]} 
						/>
					</Form.Item>

					<Form.Item name="cc" label={
								<span style={{ color: "#000000", fontWeight: "500" }}>
									CC Email Ids:
								</span>
							}>
						<Select
							mode="tags"
							options={pocOptions} // Your POC list goes here
							placeholder="Select POCs or type email and press Enter"
							className="composer-input"
							tokenSeparators={[","]} 
						/>
					</Form.Item>

					<Form.Item name="bcc" label={
								<span style={{ color: "#000000", fontWeight: "500" }}>
									BCC Email Ids:
								</span>
							}>
						<Select
							mode="tags"
							options={pocOptions} 
							placeholder="Select POCs or type email and press Enter"
							className="composer-input"
							tokenSeparators={[","]} 
						/>
					</Form.Item>


					</Card>

					<Divider style={{ borderColor: "#d9d9d9" }} />

					<Card
						style={{ marginBottom: 16, border: "1px solid #d9d9d9" }}
						title={
							<span style={{ color: "#000000", fontSize: "16px", fontWeight: "600" }}>
								Reminder Settings
							</span>
						}
					>
						<Form.Item
							name="reminderEmail"
							label={
								<span style={{ color: "#000000", fontWeight: "500" }}>
									Select Reminder Email
								</span>
							}
							rules={[{ required: true, message: "Please select a reminder email" }]}
						>
							<Select
								placeholder="Choose a reminder email draft"
								style={{ border: "1px solid #d9d9d9" }}
								styles={{
									popup: { 
										root: { 
											backgroundColor: "#ffffff",
											border: "1px solid #d9d9d9",
										}
									},
								}}
							>
								{drafts.map((draft) => (
									<Option key={draft._id} value={draft._id}>
										<span style={{ color: "#000000", padding: "8px 12px" }}>
											{draft.name}
										</span>
									</Option>
								))}
							</Select>
						</Form.Item>

						<Form.Item
							name="reminderTime"
							label={
								<span style={{ color: "#000000", fontWeight: "500" }}>
									Reminder Time (9:00 - 18:00)
								</span>
							}
							rules={[
								{
									required: reminderFrequency !== "none",
									message: "Please select a time for reminders",
								},
							]}
						>
							<Select
								placeholder="Select time for all reminders"
								disabled={reminderFrequency === "none"}
								style={{ border: "1px solid #d9d9d9" }}
								styles={{
									popup: { 
										root: { 
											backgroundColor: "#ffffff",
											border: "1px solid #d9d9d9",
										}
									},
								}}
							>
								{timeOptions.map((time) => (
									<Option key={time} value={time}>
										<span style={{ color: "#000000", padding: "8px 12px" }}>
											{time}
										</span>
									</Option>
								))}
							</Select>
						</Form.Item>

						<Form.Item
							name="reminderFrequency"
							label={
								<span style={{ color: "#000000", fontWeight: "500" }}>
									Reminder Frequency
								</span>
							}
							rules={[
								{ required: true, message: "Please select reminder frequency" },
							]}
						>
							<Select
								style={{ border: "1px solid #d9d9d9" }}
								styles={{
									popup: { 
										root: { 
											backgroundColor: "#ffffff",
											border: "1px solid #d9d9d9",
										}
									},
								}}
							>
								<Option value="none">
									<span style={{ color: "#000000" }}>No reminders</span>
								</Option>
								<Option value="single">
									<span style={{ color: "#000000" }}>Single reminder</span>
								</Option>
								<Option value="twice">
									<span style={{ color: "#000000" }}>Two reminders</span>
								</Option>
								<Option value="three">
									<span style={{ color: "#000000" }}>Three reminders</span>
								</Option>
							</Select>
						</Form.Item>

						<Form.Item
							name="repeatInterval"
							label={
								<span style={{ color: "#000000", fontWeight: "500" }}>
									Repeat Interval (Days)
								</span>
							}
							rules={[{ required: true, message: "Please select repeat interval" }]}
						>
							<Select
								style={{ border: "1px solid #d9d9d9" }}
								styles={{
									popup: { 
										root: { 
											backgroundColor: "#ffffff",
											border: "1px solid #d9d9d9",
										}
									},
								}}
								disabled={reminderFrequency === "none"}
							>
								<Option value={1}>
									<span style={{ color: "#000000" }}>Every 1 day</span>
								</Option>
								<Option value={2}>
									<span style={{ color: "#000000" }}>Every 2 days</span>
								</Option>
								<Option value={3}>
									<span style={{ color: "#000000" }}>Every 3 days</span>
								</Option>
								<Option value={7}>
									<span style={{ color: "#000000" }}>Every 7 days (Weekly)</span>
								</Option>
							</Select>
						</Form.Item>
					</Card>

					<Divider style={{ borderColor: "#d9d9d9" }} />

					<Form.Item>
						<Space>
							<Button
								onClick={handleCancel}
								style={{ border: "1px solid #d9d9d9", color: "#000000" }}
							>
								Cancel
							</Button>
							<Button
								type="primary"
								htmlType="submit"
								icon={<SendOutlined />}
								loading={isSubmitting}
								style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
							>
								Schedule Email Sequence
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title={
					<Title level={4} style={{ color: "#000000" }}>
						Confirm Email Schedule
					</Title>
				}
				open={confirmationVisible && !isSubmitting}
				onCancel={() => setConfirmationVisible(false)}
				width={600}
				footer={[
					<Button key="back" onClick={() => setConfirmationVisible(false)}>
						Cancel
					</Button>,
					<Button
						key="submit"
						type="primary"
						loading={isSubmitting}
						onClick={handleConfirmSchedule}
						style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
					>
						Confirm Schedule
					</Button>,
				]}
			>
				<Text style={{ display: "block", marginBottom: 16 }}>
					Please review the schedule for <strong>{poc.name}</strong>. The following emails
					will be sent:
				</Text>
				<List
					itemLayout="horizontal"
					dataSource={confirmationSequence}
					renderItem={(item, index) => (
						<List.Item>
							<List.Item.Meta
								avatar={
									<Avatar
										style={{
											backgroundColor:
												item.type === "Welcome" ? "#1890ff" : "#faad14",
										}}
										icon={
											item.type === "Welcome" ? (
												<SendOutlined />
											) : (
												<ClockCircleOutlined />
											)
										}
									/>
								}
								title={
									<span style={{ color: "#000000", fontWeight: "600" }}>
										{item.type} Email #{index + 1}
									</span>
								}
								description={
									<>
										<Text style={{ color: "#000000" }}>
											<strong>Draft:</strong> {item.draft.name}
										</Text>
										<br />
										<Text style={{ color: "#1890ff", fontWeight: "500" }}>
											<strong>Time:</strong>{" "}
											{item.time.format("dddd, MMMM D, YYYY [at] h:mm A")}
										</Text>
									</>
								}
							/>
						</List.Item>
					)}
				/>
				<Divider />
				<Text style={{ fontStyle: "italic", color: "#666666" }}>
					{`A confirmation email will also be sent to ${user_email}.`}
				</Text>
			</Modal>
		</>
	);
};

export default EmailAutomationModal;
