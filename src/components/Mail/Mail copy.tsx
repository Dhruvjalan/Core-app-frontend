// crossroads-frontend/src/components/Mail/Mail.tsx
import { Button, Flex, Collapse } from "antd";
import { useState } from "react";
import { decode } from "html-entities";
import { MailOutlined, UserOutlined, CalendarOutlined, EyeOutlined, EyeInvisibleOutlined, ClockCircleOutlined, MessageOutlined } from "@ant-design/icons";
import "../../assets/styles/Mail.css";

type Header = {
  name: string;
  value: string;
};

type MailProps = {
  mail: any;
  isExpanded?: boolean;
  isThread?: boolean;
  threadActivities?: any[]; // Add thread activities prop
};

function urlSafeBase64Decode(encodedString: string) {
  const decodedString = atob(encodedString.replace(/-/g, "+").replace(/_/g, "/"));
  return decodedString;
}

const Mail = ({ mail, isExpanded = false, isThread = false, threadActivities = [] }: MailProps) => {
  const [isFullDisplay, setIsFullDisplay] = useState(isExpanded);
  const [activeThreadKeys, setActiveThreadKeys] = useState<string[]>([]);
  
  const hasThread = threadActivities && threadActivities.length > 0;
  
  const renderHTML = (htmlString: string) => {
    return { __html: htmlString };
  };

  // Handle both Gmail API format and simplified format
  let sender: string;
  let date: Date;
  let subject: string;
  let htmlBody: string;

  if (mail.payload && mail.payload.headers) {
    // Gmail API format
    sender = mail.payload.headers
      .find((header: Header) => header.name === "From")
      ?.value || "Unknown Sender";
    
    const dateHeader = mail.payload.headers
      .find((header: Header) => header.name === "Date")
      ?.value;
    date = dateHeader ? new Date(dateHeader) : new Date();
    
    subject = mail.payload.headers
      .find((header: Header) => header.name === "Subject")
      ?.value || "No Subject";
    
    // Extract HTML body from Gmail payload
    const parts = mail.payload.parts || [mail.payload];
    const htmlPart = parts.find((part: any) => part.mimeType === 'text/html');
    htmlBody = htmlPart?.body?.data ? urlSafeBase64Decode(htmlPart.body.data) : mail.snippet || '';
  } else {
    // Simplified format (your current object)
    sender = mail.from || "Unknown Sender";
    date = mail.date ? new Date(mail.date) : new Date();
    subject = mail.subject || "No Subject";
    htmlBody = mail.body || mail.snippet || '';
  }

  const decodedHtml = decode(htmlBody, { level: "html5" }).replace("Â", "");
  const formattedTime = date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  const handleThreadToggle = (keys: string | string[]) => {
    setActiveThreadKeys(Array.isArray(keys) ? keys : [keys]);
  };

  return (
    <div className={`mail-item ${isFullDisplay ? 'expanded' : ''} ${isThread ? 'thread-item' : ''}`}>
      <Flex justify="space-between" align="start" className="mail-header" onClick={() => setIsFullDisplay(!isFullDisplay)}>
        <Flex gap={12} align="start" className="mail-sender-info">
          <Flex vertical className="mail-details">
            <Flex align="center" gap={8} className="mail-sender">
              <UserOutlined className="mail-icon" />
              <span className="sender-name">{sender}</span>
            </Flex>
            <Flex align="center" gap={8} className="mail-subject">
              <MailOutlined className="mail-icon" />
              <span className="subject-text">{subject}</span>
            </Flex>
            {!isFullDisplay && mail.snippet && (
              <div 
                className="mail-snippet" 
                dangerouslySetInnerHTML={renderHTML(mail.snippet)}
              />
            )}
          </Flex>
        </Flex>
        
        <Flex vertical align="end" gap={8} className="mail-meta">
          <Flex align="center" gap={6} className="mail-date">
            <CalendarOutlined className="mail-icon" />
            <span>{date.toLocaleDateString()}</span>
          </Flex>
          <Flex align="center" gap={6} className="mail-date-time">
            <ClockCircleOutlined className="mail-icon" />
            <span>{formattedTime}</span>
          </Flex>
          {hasThread && (
            <Flex align="center" gap={6} className="thread-count">
              <MessageOutlined className="mail-icon" />
              <span>{threadActivities.length} replies</span>
            </Flex>
          )}
          <Button 
            type="text" 
            icon={isFullDisplay ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              setIsFullDisplay(!isFullDisplay);
            }}
            className="toggle-display-btn"
          >
            {isFullDisplay ? 'Collapse' : 'Expand'}
          </Button>
        </Flex>
      </Flex>

      {isFullDisplay && (
        <div className="mail-body">
          <div 
            className="mail-content" 
            dangerouslySetInnerHTML={{ __html: decodedHtml }} 
          />
          
          {hasThread && (
            <div className="mail-thread">
              <Collapse 
                activeKey={activeThreadKeys}
                onChange={handleThreadToggle}
                expandIconPosition="end"
                className="thread-collapse"
                items={[
                  {
                    key: 'thread',
                    label: `Thread (${threadActivities.length} messages)`,
                    children: (
                      <div className="thread-messages">
                        {threadActivities.map((threadMail, index) => (
                          <div key={threadMail.id} className="thread-message">
                            <Flex justify="space-between" align="start" className="thread-header">
                              <Flex align="center" gap={8} className="thread-sender">
                                <UserOutlined className="thread-icon" />
                                <span className="thread-sender-name">{threadMail.from || "Unknown Sender"}</span>
                              </Flex>
                              <Flex align="center" gap={6} className="thread-date">
                                <CalendarOutlined className="thread-icon" />
                                <span>{new Date(threadMail.date).toLocaleDateString()}</span>
                                <ClockCircleOutlined className="thread-icon" />
                                <span>{new Date(threadMail.date).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit',
                                  hour12: true 
                                })}</span>
                              </Flex>
                            </Flex>
                            <div className="thread-content">
                              <div 
                                dangerouslySetInnerHTML={{ 
                                  __html: decode(threadMail.body || threadMail.snippet || '', { level: "html5" }).replace("Â", "")
                                }} 
                              />
                            </div>
                            {index < threadActivities.length - 1 && <div className="thread-divider" />}
                          </div>
                        ))}
                      </div>
                    )
                  }
                ]}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Mail;