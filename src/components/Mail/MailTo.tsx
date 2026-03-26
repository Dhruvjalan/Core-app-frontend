// crossroads-frontend\src\components\Mail\MailTo.tsx
import { Button, Flex, Input } from "antd";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "/src/assets/styles/quillStyles.css";
import axios from "../../utils/_axios";

const MailTo = ({ setAction, mailId }: { setAction: Function; mailId?: string }) => {
	function removeTags(str: string) {
		if (str === null || str === "") return false;
		else str = str.toString();
		return str.replace(/(<([^>]+)>)/gi, "");
	}

	const [mail, setMail] = useState<string>(mailId ? mailId : "");
	const [subject, setSubject] = useState("");
	const [body, setBody] = useState("");

	const sendMail = () => {
		const textBody = removeTags(body);
		axios
			.post("/mail/send", {
				to: mail,
				subject,
				body,
				textBody,
			})
			.then(() => {
				// console.log("sent mail");
			})
			.catch(() => console.error("failed"));
		setAction("");
	};

	return (
		<Flex vertical gap={20}>
			<Flex align="center">
				<label
					style={{
						fontSize: 20,
						marginLeft: 10,
						fontWeight: 400,
						color: "var(--text-50)",
					}}
				>
					To:
				</label>
				<Input
					style={{
						background: "none",
						border: "none",
						height: 50,
						width: "100%",
					}}
					onChange={(e) => {
						setMail(e.target.value);
					}}
					value={mail}
				/>
			</Flex>
			<Input
				style={{
					background: "none",
					border: "none",
					fontWeight: 500,
					height: 50,
				}}
				placeholder="Subject"
				value={subject}
				onChange={(e) => setSubject(e.target.value)}
			/>
			<ReactQuill value={body} onChange={setBody} style={{ marginBottom: 40 }} />
			<Button
				style={{ background: "var(--primary)", border: "none", width: 200, height: 40 }}
				onClick={sendMail}
			>
				Send
			</Button>
		</Flex>
	);
};

export default MailTo;
