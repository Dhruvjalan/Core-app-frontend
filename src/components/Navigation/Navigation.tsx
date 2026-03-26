import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import Navbar from "./Navbar";
import LeftSidebar from "./LeftSidebar";
// import Companies from "./Companies";
// import { useState } from "react";
import RightSidebar from "./RightSidebar";
import Company from "../../types/company";

export const NavigationOverlay = ({
	company,
	children,
}: {
	company: Company | undefined;
	children?: React.ReactNode | undefined;

}) => {
	return (
		<Layout style={{ backgroundColor: "none", height: "100vh" }}>
			<Header style={{ width: "100vw", padding: 0, margin: 0 }}>
				<Navbar	/>
			</Header>
			<Layout style={{ background: "none" }}>
				<Sider collapsed={true} collapsedWidth="min-content">
					<LeftSidebar
					/>
				</Sider>
				{/* <Sider collapsedWidth="0" collapsed={areCompaniesVisible}>
					 <Companies activeCompany={company} setActiveCompany={setCompany} visible={areCompaniesVisible}/> 
				</Sider> */}
				<Content style={{ background: "var(--neutral)" }}>{children}</Content>
				<Sider collapsed={true} collapsedWidth="min-content">
					{company && company.pocs && <RightSidebar/>}
				</Sider>
			</Layout>
		</Layout>
	);
};
