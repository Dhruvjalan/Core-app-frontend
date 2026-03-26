// crossroads-frontend/src/components/Mail/ThreadMail.tsx
import { useState } from "react";
import { Button, Flex } from "antd";
import { 
  MailOutlined, UserOutlined, CalendarOutlined, 
  EyeOutlined, EyeInvisibleOutlined, ClockCircleOutlined,
  CaretRightOutlined, CaretDownOutlined 
} from "@ant-design/icons";
import { decode } from "html-entities";
import "../../assets/styles/ThreadMail.css";

type ThreadMailProps = {
  thread: any[];
};

const ThreadMail = ({ thread }: ThreadMailProps) => {
  const [expandedMails, setExpandedMails] = useState<Set<string>>(new Set());
  const [isThreadCollapsed, setIsThreadCollapsed] = useState(false);

  if (!thread || thread.length === 0) return null;

  const firstMail = thread[0];
  const subject = firstMail.subject || "No Subject";
  // const threadId = firstMail.threadId;

  const toggleMailExpansion = (mailId: string) => {
    const newExpanded = new Set(expandedMails);
    if (newExpanded.has(mailId)) {
      newExpanded.delete(mailId);
    } else {
      newExpanded.add(mailId);
    }
    setExpandedMails(newExpanded);
  };

  const toggleThreadCollapse = () => {
    setIsThreadCollapsed(!isThreadCollapsed);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderHTML = (htmlString: string) => {
    return { __html: htmlString };
  };

  return (
    <div className="thread-container">
      <div className="thread-header" onClick={toggleThreadCollapse}>
        <Flex justify="space-between" align="center" className="w-full">
          <Flex align="center" gap={8}>
            <Button 
              type="text" 
              icon={isThreadCollapsed ? <CaretRightOutlined /> : <CaretDownOutlined />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                toggleThreadCollapse();
              }}
            />
            <MailOutlined className="thread-icon" />
            <span className="thread-subject">{subject}</span>
            <span className="thread-count">({thread.length} messages)</span>
          </Flex>
          <span className="thread-date">
            {formatDate(firstMail.date)} - {formatDate(thread[thread.length - 1].date)}
          </span>
        </Flex>
      </div>

      {!isThreadCollapsed && (
        <div className="thread-content">
          {thread.map((mail, index) => {
            const isExpanded = expandedMails.has(mail.id);
            const isLast = index === thread.length - 1;
            
            return (
              <div 
                key={mail.id} 
                className={`thread-mail ${isExpanded ? 'expanded' : ''} ${isLast ? 'last-mail' : ''}`}
              >
                <div className="mail-timeline">
                  <div className="timeline-dot"></div>
                  {!isLast && <div className="timeline-line"></div>}
                </div>
                
                <div className="mail-content-wrapper">
                  <Flex justify="space-between" align="start" className="mail-header">
                    <Flex gap={12} align="start" className="mail-sender-info">
                      <Flex vertical className="mail-details">
                        <Flex align="center" gap={8} className="mail-sender">
                          <UserOutlined className="mail-icon" />
                          <span className="sender-name">{mail.from}</span>
                        </Flex>
                        {!isExpanded && mail.snippet && (
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
                        <span>{formatDate(mail.date)}</span>
                      </Flex>
                      <Flex align="center" gap={6} className="mail-date-time">
                        <ClockCircleOutlined className="mail-icon" />
                        <span>{formatTime(mail.date)}</span>
                      </Flex>
                      <Button 
                        type="text" 
                        icon={isExpanded ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        onClick={() => toggleMailExpansion(mail.id)}
                        className="toggle-display-btn"
                      >
                        {isExpanded ? 'Collapse' : 'Expand'}
                      </Button>
                    </Flex>
                  </Flex>

                  {isExpanded && (
                    <div className="mail-body">
                      <div 
                        className="mail-content" 
                        dangerouslySetInnerHTML={{ __html: decode(mail.body || mail.snippet || '') }} 
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThreadMail;