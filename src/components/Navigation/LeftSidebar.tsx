import { Flex, Button } from "antd";
// import { Popover } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom"
import {
	faCircleQuestion,
	faFolder,
	faHome,
	faVideoCamera,
} from "@fortawesome/free-solid-svg-icons";

const menuButtonStyle = {
	background: "none",
	border: "none",
	color: "var(--text)"
};

const LeftSidebar = () => {
	  const navigate = useNavigate()

	return (
		<Flex
			vertical
			className="left-sidebar"
			gap="1%"
			style={{ padding: 10, border: "1px solid var(--primary)", height: "100%", color: "#ffffff" }}
		>
			<Button
				icon={<FontAwesomeIcon icon={faHome} size="2x" />}
				size="large"
				style={menuButtonStyle}
				onClick={() => {
					navigate("/dashboard");
					// setAreCompaniesVisible(!areCompaniesVisible)
				}}
			/>
			<Button
				icon={<FontAwesomeIcon icon={faFolder} size="2x" />}
				size="large"
				style={menuButtonStyle}
			/>
			<Button
				icon={<FontAwesomeIcon icon={faVideoCamera} size="2x" />}
				size="large"
				style={menuButtonStyle}
				onClick={() => {
					window.open("https://meet.google.com/");
				}}
			/>
			<Button
				icon={<FontAwesomeIcon icon={faCircleQuestion} size="2x" />}
				size="large"
				style={menuButtonStyle}
			/>
		</Flex>
	);
};

export default LeftSidebar;
