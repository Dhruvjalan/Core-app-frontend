import { Button, Divider, Flex } from "antd";
import { faNoteSticky, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

// type POC = {
// 	_id: string;
// 	name: string;
// 	email: string;
// 	phoneNumber: string;
// 	companyId: string;
// 	__v: number;
// };

const RightSidebar = () => {
const navigate = useNavigate();

	return (
		<Flex style={{ width: "min-content", padding: 10, gap: 10 }} vertical>
			{/* {list.map((poc) => {
				const splitname = poc.name.split(" ");
				const initials =
					splitname.length >= 2 ? splitname[0][0] + splitname[1][0] : splitname[0][0];
				return (
					<Button
						key={poc._id}
						shape="circle"
						size="large"
						style={{ background: "none" }}
						onClick={() => {
							navigate(`/poc/${poc._id}`);
						}}
					>
						{initials}
					</Button>
				);
			})} */}
			<Button
				size="large"
				style={{ background: "var(--secondary)", color: "var(--text)" }}
				shape="circle"
				icon={<FontAwesomeIcon icon={faPlus} />}
				onClick={() => navigate("/addPOC")}
			></Button>
			<Divider style={{ borderTopColor: "white", color: "white" }} />
			<Button
				shape="circle"
				size="large"
				style={{ background: "none", color: "white" }}
				icon={<FontAwesomeIcon icon={faNoteSticky} />}
				onClick={() => navigate("/notes")}
			></Button>
		</Flex>
	);
};

export default RightSidebar;
