import { DownOutlined } from "@ant-design/icons"
import { Button, Dropdown, Flex, MenuProps, Space } from "antd"
import axios from "../../utils/_axios"
import { useEffect, useState } from "react"
import type Company from "../../types/company"
import { Navigate } from "react-router-dom"
// import { color } from "framer-motion"

const Header = ({
	company,
}: {
	company: Company | undefined
}) => {
	if (company === undefined) return <Navigate to="/dashboard" replace />

	const [dealStatus, setDealStatus] = useState(company ? company.dealStatus : undefined)

	useEffect(() => {
		setDealStatus(company ? company.dealStatus : undefined)
	}, [company])

	const handleStatusChange = (dealStatus: string) => {
		axios
			.post("/company/updateDealStatus", {
				companyId: company._id,
				dealStatus,
			})
			.then(() => {
				setDealStatus(dealStatus)
			})
			.catch((err) => {
				console.error(err)
			})
	}

	const items: MenuProps["items"] = [
		{ key: "1", label: <a onClick={() => handleStatusChange("no contact")}><p style={{color:"white"}}>No Contact</p></a> },
		{ key: "2", label: <a onClick={() => handleStatusChange("mailed")}><p style={{color:"white"}}>Mailed</p></a> },
		{ key: "3", label: <a onClick={() => handleStatusChange("ongoing")}><p style={{color:"white"}}>Ongoing</p></a> },
		{ key: "4", label: <a onClick={() => handleStatusChange("confirmed")}><p style={{color:"white"}}>Confirmed</p></a> },
		{ key: "5", label: <a onClick={() => handleStatusChange("dead")}><p style={{color:"white"}}>Dead</p></a> },
		{ key: "6", label: <a onClick={() => handleStatusChange("priority")}><p style={{color:"white"}}>Priority</p></a> },
		{ key: "7", label: <a onClick={() => handleStatusChange("later")}><p style={{color:"white"}}>Later</p></a> },
	]

	return (
		<Flex justify="space-between" align="center" style={{ width: "100%" }}>
			<Flex style={{ height: 80, width: "100%" }} align="center" gap={12}>
				<Flex
					style={{
						fontWeight: 800,
						fontSize: 36,
						backgroundImage: "linear-gradient(to right, #fff, #bbb)",
						backgroundClip: "text",
						WebkitTextFillColor: "transparent",
					}}
				>
					{company && company.name}
				</Flex>
				<Dropdown
					menu={{ items }}
					overlayStyle={{ border: "1px solid var(--text)", borderRadius: 5 }}
				>
					<Space
						style={{
							backgroundColor: "var(--secondary-50)",
							padding: 14,
							borderRadius: 100,
							fontSize: 18,
							textTransform: "capitalize",
						}}
					>
						{dealStatus}
						<DownOutlined />
					</Space>
				</Dropdown>
			</Flex>
			<Button
				style={{
					backgroundImage: "linear-gradient(135deg, var(--accent) -12%, var(--primary) 75%)",
					border: "none",
					width: 150,
					height: 40,
					borderRadius: 5,
				}}
			>
				<p style={{color: "#FFFFFF"}}>Draft MOU</p>
			</Button>
		</Flex>
	)
}

export default Header
