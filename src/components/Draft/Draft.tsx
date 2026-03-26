// crossroads-frontend/src/components/Draft/Draft.tsx
import { Button, Flex, Tag } from "antd";
import { useState } from "react";
import { FileTextOutlined, EyeOutlined, EyeInvisibleOutlined, CalendarOutlined, UserOutlined, 
  PaperClipOutlined } from "@ant-design/icons";
import DOMPurify from 'dompurify'; 
import "../../assets/styles/Draft.css";

type Attachment = {
  uid: string;
  name: string;
  url?: string;
};

type DraftType = {
  _id: string;
  name: string;
  subject: string;
  lastModified: Date;
  content: string;
  notes?: string;
  to?: string[];
  cc?: string[];
  bcc?: string[];
  attachments?: Attachment[];
};

type DraftProps = {
  draft: DraftType;
  onEdit: (draft: any) => void;
  onDelete: (draftId: string) => void;
};

const RecipientTags = ({ label, emails }: { label: string, emails?: string[] }) => {
  if (!emails || emails.length === 0) {
    return null;
  }
  return (
    <Flex align="start" gap={4} className="recipient-field">
      <span className="recipient-label">{label}:</span>
      <Flex wrap="wrap" gap={4}>
        {emails.map((email) => (
          <Tag key={email} icon={<UserOutlined />} className="recipient-tag">{email}</Tag>
        ))}
      </Flex>
    </Flex>
  );
};

const Draft = ({ draft, onEdit, onDelete }: DraftProps) => {
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [isAttachmentsExpanded, setIsAttachmentsExpanded] = useState(false); 
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="draft-item">
      <Flex justify="space-between" align="start" className="draft-header">
  			<Flex gap={12} align="start" className="draft-info">
  				<div className="draft-avatar">
  					<FileTextOutlined />
  				</div>
  				<Flex vertical className="draft-details">
  					<Flex align="center" className="draft-name" style={{ marginBottom: "0px", fontSize  : "16px", fontWeight: "600" }}>
  						<span className="name-text">{draft.name || "Unnamed Draft"}</span>
  					</Flex>
  					<Flex align="center" className="draft-subject" style={{ marginBottom: "0px",marginTop: "0px", fontSize  : "14px" }}>
  						<span className="subject-text">{draft.subject || "No subject"}</span>
  					</Flex>
  					<Flex align="center" className="draft-date">
  						<CalendarOutlined className="draft-icon" />
  						<span>{formatDate(draft.lastModified)}</span>
  					</Flex>
  				</Flex>
  			</Flex>
        
        <Flex gap={8} className="draft-actions">
          <Button 
            size="small"
            type="text"
            onClick={() => onEdit(draft)}
            className="draft-action-btn"
          >
            Edit
          </Button>
          <Button 
            size="small"
            type="text"
            danger
            onClick={() => onDelete(draft._id)}
            className="draft-action-btn"
          >
            Delete
          </Button>
        </Flex>
      </Flex>




      {/* Content Section - UPDATED WITH HTML RENDERING */}
      <div className="draft-section ds1">
        <Flex justify="space-between" align="center" className="section-header">
          <span className="section-title">Email Content</span>
          <Button 
            type="text" 
            size="small"
            icon={isContentExpanded ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onClick={() => setIsContentExpanded(!isContentExpanded)}
            className="toggle-section-btn"
          >
            {isContentExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </Flex>
        {isContentExpanded && (
          <div className="section-content">
            <div className="draft-content">
              {draft.content ? (
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(draft.content) 
                  }} 
                />
              ) : (
                <span className="no-content">No content yet</span>
              )}
            </div>
          </div>
        )}
      </div>

        {/* --- NEW Attachments Section --- */}
      {draft.attachments && draft.attachments.length > 0 && (
        <div className="draft-section">
          <Flex justify="space-between" align="center" className="section-header">
            <span className="section-title">Attachments ({draft.attachments.length})</span>
            <Button 
              type="text" 
              size="small"
              icon={isAttachmentsExpanded ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => setIsAttachmentsExpanded(!isAttachmentsExpanded)}
              className="toggle-section-btn"
            >
              {isAttachmentsExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </Flex>
          {isAttachmentsExpanded && (
            <div className="section-content">
              <div className="attachment-list">
                {draft.attachments.map(file => (
                  <div key={file.uid} className="attachment-item">
                    <PaperClipOutlined className="attachment-icon" />
                    {file.url ? (
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="attachment-name">
                        {file.name}
                      </a>
                    ) : (
                      <span className="attachment-name">{file.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notes Section - Keep as plain text */}
      {draft.notes && (
        <div className="draft-section">
          <Flex justify="space-between" align="center" className="section-header">
            <span className="section-title">Internal Notes</span>
            <Button 
              type="text" 
              size="small"
              icon={isNotesExpanded ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => setIsNotesExpanded(!isNotesExpanded)}
              className="toggle-section-btn"
            >
              {isNotesExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </Flex>
          {isNotesExpanded && (
            <div className="section-content">
              <div className="draft-notes">
                {draft.notes}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Draft;