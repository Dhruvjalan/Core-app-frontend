import { useState, useEffect } from "react";
import axios from "../../utils/_axios";
import { Flex, Input } from "antd";
import Company from "../../types/company";

const Companies = ({
	activeCompany,
	setActiveCompany,
}: {
	activeCompany: Company | undefined;
	setActiveCompany: React.Dispatch<React.SetStateAction<Company | undefined>>;
	// areCompaniesVisible: Boolean;
}) => {
	const [companiesList, setCompaniesList] = useState<Array<Company>>([]);
	useEffect(() => {
		axios.get("/user/assignedCompanies").then((res) => {
			setCompaniesList(res.data.companies as Array<Company>);
			return;
		});
	}, []);

	return (
		<Flex
			vertical
			gap={30}
			style={{
				paddingTop: "10%",
				border: "1px solid #4A5FBD",
				borderLeft: "none",
				height: "100%",
			}}
		>
			<Flex
				justify="center"
				style={{
					fontSize: "30px",
					fontWeight: "bold",
					background: "linear-gradient(to left, #ddd, #fff)",
					backgroundClip: "text",
					color: "transparent",
				}}
			>
				Companies
			</Flex>
			<Flex align="center" justify="center" style={{color:"#ffffff"}}>
				<Input
					bordered={false}
					style={{
						backgroundColor: "#34384980",
						height: "180%",
						fontSize: "1rem",
						width: "90%",
					}}
					placeholder="Search companies"
				/>
			</Flex>
			<Flex vertical style={{ color: "#ffffff" }}>
				{companiesList
					.filter((company) => company?.name && company?._id)
					.map((company) => (
						<Flex
							key={company._id}
							style={{
								padding: 10,
								paddingTop: 20,
								paddingBottom: 20,
								fontWeight: "normal",
								background:
									activeCompany && company._id === activeCompany._id
										? "linear-gradient(to right, #4A5FBDDF, #4A5FBD20)"
										: "none",
							}}
							onClick={() => {
								//console.log("Company: ", company);
								setActiveCompany(company);
							}}
						>
							{company.name}
						</Flex>
					))}
			</Flex>
		</Flex>
	);
};

export default Companies;
