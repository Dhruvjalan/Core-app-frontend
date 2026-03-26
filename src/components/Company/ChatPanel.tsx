import { useEffect, useState } from "react";
import axios from "../../utils/_axios";
import { Flex, Input, Button } from "antd";

export default function ChatPanel({ poc, companyId }: { poc: any; companyId: string }) {
	const [messages, setMessages] = useState<any[]>([]);
	const [text, setText] = useState<string>("");

	useEffect(() => {
		async function fetchMessages() {
			const res = await axios.get(`/company/${companyId}/poc/${poc._id}/threads`, {
				withCredentials: true,
			});
			setMessages(res.data.messages);
		}
		fetchMessages();
	}, [companyId, poc._id]);

	const sendMessage = async () => {
		if (!text) return;
		await axios.post(
			`/company/${companyId}/poc/${poc._id}/thread`,
			{ text },
			{ withCredentials: true }
		);
		setText("");
		const res = await axios.get(`/company/${companyId}/poc/${poc._id}/threads`, {
			withCredentials: true,
		});
		setMessages(res.data.messages);
	};

	return (
		<Flex vertical gap={16} style={{ height: "100%" }}>
			<div style={{ flex: 1, overflowY: "auto", paddingRight: 8 }}>
				{messages.map((msg, idx) => (
					<Flex key={idx} style={{ marginBottom: 8 }}>
						<strong>{msg.senderName}:</strong>&nbsp;{msg.text}
					</Flex>
				))}
			</div>

			<Flex gap={8} align="center">
				<Input.TextArea
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder="Type a message..."
					autoSize={{ minRows: 2, maxRows: 4 }}
				/>
				<Button type="primary" onClick={sendMessage} style={{ height: 40 }}>
					Send
				</Button>
			</Flex>
		</Flex>
	);
}
