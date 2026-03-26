import React, { useEffect, useState } from 'react';
import { Steps, Spin, Card, Typography, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { POC } from '../../utils/types';
import { getJobsForPoc, getThreadsByPocId } from '../../utils/emailHandler';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { Step } = Steps;

interface AutomationTimelineProps {
  poc: POC;
  onStatusUpdate: (message: string, type: 'success' | 'info' | 'error') => void;
}

interface JobData {
  name: string;
  data: {
    subject: string;
    scheduledTime: string;
  };
  nextRunAt: string;
  failedAt?: string;
}

interface ThreadData {
  _id: string;
  threadId: string;
  sent_emails: number;
  totalEmailsInSequence?: number;
  updatedAt: string;
  pocId: string;
}

export const AutomationTimeline: React.FC<AutomationTimelineProps> = ({ poc, onStatusUpdate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<'running' | 'paused' | 'completed' | 'error'>('paused');
  const [sentCount, setSentCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pendingJobs, setPendingJobs] = useState<JobData[]>([]);
  const [failedJobs, setFailedJobs] = useState<JobData[]>([]);

  const fetchData = async () => {
    if (!poc?._id) return;
    setIsLoading(true);

    try {
      const [jobsRes, threadsRes] = await Promise.all([
        getJobsForPoc(poc._id),
        getThreadsByPocId(poc._id),
      ]);

      const pending: JobData[] = jobsRes.pendingJobs || [];
      const failed: JobData[] = jobsRes.failedJobs || [];
      const allThreads: ThreadData[] = threadsRes.threads || [];
      
      const mostRecentThread = allThreads.length > 0 ? allThreads[0] : null;

      const emailsSent = mostRecentThread?.sent_emails || 0;
      const totalEmails = mostRecentThread?.totalEmailsInSequence || 0; 

      setPendingJobs(pending);
      setFailedJobs(failed);
      setSentCount(emailsSent);
      setTotalCount(totalEmails); 
      // console.log("Setting total= ",totalEmails)

      // Determine the status
      if (failed.length > 0) {
        setStatus('error');
      } else if (pending.length > 0) {
        setStatus('running');
      } else if (totalEmails > 0 && emailsSent === totalEmails) {
        const completedAt = dayjs(mostRecentThread?.updatedAt); 
        const now = dayjs();
        const minutesSinceCompleted = now.diff(completedAt, 'minute');

        if (minutesSinceCompleted > 10) {
          setStatus('paused');
          setTotalCount(0); 
        } else {
          setStatus('completed');
        }
      } else {
        setStatus('paused');
      }
    } catch (error) {
      console.error("Error fetching timeline data:", error);
      setStatus('error');
      onStatusUpdate('Could not load timeline data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [poc]);


  if (isLoading) {
    return (
      <Card className="automation-timeline-card">
        <Spin style={{ width: '100%' }} />
      </Card>
    );
  }

  if (status === 'paused' || totalCount === 0) {
    return (
      <Card className="automation-timeline-card">
        <Title level={5} style={{ color: 'white', margin: 0, fontWeight: 500 }}>
          Automation Status
        </Title>
        <Text style={{ color: '#9aa0a6' }}>
          No email sequence is currently scheduled for this POC.
        </Text>
      </Card>
    );
  }

  if (status === 'completed') {
    return (
      <Card className="automation-timeline-card">
        <Title level={5} style={{ color: 'white', margin: 0, fontWeight: 500, marginBottom: '20px' }}>
          Automation Completed
        </Title>
        <Steps current={totalCount} status="finish" size="small" direction="horizontal" responsive={false}>
          {[...Array(totalCount)].map((_, i) => (
            <Step
              key={i}
              title={i==0?"Welcome Email":`Reminder #${i}`}
              description="Sent"
              icon={<CheckCircleOutlined />}
            />
          ))}
        </Steps>
      </Card>
    );
  }

  const stepItems = [];
  let currentStepIndex = 0;

  for (let i = 0; i < sentCount; i++) {
    stepItems.push(
      <Step
        key={`sent-${i}`}
        title={i==0?"Welcome Email":`Reminder #${i}`}
        description="Sent"
        status="finish"
        icon={<CheckCircleOutlined />}
      />
    );
    currentStepIndex++;
  }

  if (status === 'error' && failedJobs.length > 0) {
    stepItems.push(
      <Step
        key={`fail-${currentStepIndex}`}
        title={currentStepIndex==0 ? "Welcome Email": `Reminder #${currentStepIndex}`}
        description="Failed"
        status="error"
        icon={<CloseCircleOutlined />}
      />
    );
    currentStepIndex++;
  } else if (status === 'running' && pendingJobs.length > 0) {
    const nextJobTime = dayjs(pendingJobs[0].nextRunAt);
    stepItems.push(
      <Step
        key={`running-${currentStepIndex}`}
        title={currentStepIndex==0 ? "Welcome Email": `Reminder #${currentStepIndex}`}
        description={
          <Tooltip title={nextJobTime.format('MMM D, YYYY h:mm A')}>
            {`Due ${nextJobTime.fromNow()}`}
          </Tooltip>
        }
        status="process" 
        icon={<LoadingOutlined />}
      />
    );
    currentStepIndex++;
  }

  while (currentStepIndex < totalCount) {
    stepItems.push(
      <Step
        key={`wait-${currentStepIndex}`}
        title={currentStepIndex==0 ? "Welcome Email": `Reminder #${currentStepIndex}`}
        description="Scheduled"
        status="wait"
        icon={<ClockCircleOutlined />}
      />
    );
    currentStepIndex++;
  }

  return (
    <Card className="automation-timeline-card">
      <Title level={5} style={{ color: 'white', margin: 0, fontWeight: 500, marginBottom: '20px' }}>
        {status === 'error' ? 'Automation Error' : 'Automation Running'}
      </Title>
      <Steps
        current={sentCount} // This highlights the currently active step
        status={status === 'error' ? 'error' : 'process'}
        size="small"
        direction="horizontal"
        responsive={false}
      >
        {stepItems}
      </Steps>
    </Card>
  );
};

