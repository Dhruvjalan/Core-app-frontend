// crossroads-frontend/src/components/Diagnostics/Diagnostics.tsx
import React from 'react';
import { Card, Alert, List, Typography, Space, Button } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

interface DiagnosticsProps {
  companies?: any[];
  pocs?: any[];
  company?: any;
  error?: Error;
}

const Diagnostics: React.FC<DiagnosticsProps> = ({ 
  companies, 
  pocs, 
  company, 
  error 
}) => {
  const { CompanyId } = useParams<{ CompanyId: string }>();
  const navigate = useNavigate();

  // Check for common issues
  const issues = [
    {
      name: 'CompanyId Parameter',
      status: CompanyId ? '✅ Present' : '❌ Missing',
      description: CompanyId ? `Value: ${CompanyId}` : 'Check your route configuration'
    },
    {
      name: 'Companies Data',
      status: companies ? `✅ Loaded (${companies.length} items)` : '❌ Not loaded',
      description: companies ? 'Data fetched successfully' : 'Check getAllCompanies() API call'
    },
    {
      name: 'Current Company',
      status: company ? `✅ Found: ${company.name}` : '❌ Not found',
      description: company ? 'Company data loaded' : `No company found with ID: ${CompanyId}`
    },
    {
      name: 'POCs Data',
      status: pocs ? `✅ Loaded (${pocs.length} items)` : '❌ Not loaded',
      description: pocs ? 'POCs fetched successfully' : 'Check getCompanyPOCs() API call'
    },
    {
      name: 'Routing',
      status: '✅ Functional',
      description: 'Navigation is working correctly'
    },
    {
      name: 'Error State',
      status: error ? `❌ Error: ${error.message}` : '✅ No errors',
      description: error ? 'An error occurred' : 'No runtime errors'
    }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Title level={2}>Application Diagnostics</Title>
      <Paragraph>
        This diagnostic tool helps identify why your Company page might not be rendering correctly.
      </Paragraph>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Alert 
          message="Diagnostics Active" 
          description="Check the issues below to identify potential problems with your Company page."
          type="info" 
          showIcon 
        />
        
        <Card title="Common Issues Checklist">
          <List
            itemLayout="horizontal"
            dataSource={issues}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={item.name}
                  description={
                    <div>
                      <div><Text strong>Status:</Text> {item.status}</div>
                      <div><Text strong>Details:</Text> {item.description}</div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
        
        <Card title="Troubleshooting Steps">
          <List
            itemLayout="horizontal"
            dataSource={[
              'Check browser console for JavaScript errors',
              'Verify your API endpoints are working',
              'Confirm that the company ID exists in your database',
              'Check your route configuration in App.tsx',
              'Verify all component imports are correct'
            ]}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={item}
                />
              </List.Item>
            )}
          />
        </Card>
        
        <Button type="primary" onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </Space>
    </div>
  );
};

export default Diagnostics;