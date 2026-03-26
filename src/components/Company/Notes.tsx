import React, { useState } from 'react';
  import {AlertStatus } from "@chakra-ui/react";

import { Flex, Button } from 'antd';
import NotesRichTextEditor from '../NotesRichTextEditor';

interface AlertDownProps {
  text: string;
  mode: AlertStatus; 
}

interface NotesProps {
  company: any;
  setCompany: (company: any) => void;
  setCompanyAlert: React.Dispatch<React.SetStateAction<AlertDownProps>>
  setShowAlert: React.Dispatch<React.SetStateAction<Boolean>>;
}

const Notes: React.FC<NotesProps> = ({
  company,
  setCompany,
  setCompanyAlert,
  setShowAlert,
}) => {
  const [notes, setNotes] = useState(company.notes || '');
  const [isSaving, setIsSaving] = useState(false);


  	const alert = (alertProp: AlertDownProps)=>{
    // setShowAlert(false);
    setCompanyAlert(alertProp);
    setShowAlert(true);
    setTimeout(()=>setShowAlert(false),2500);
  }


  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
     
      
      setCompany({
        ...company,
        notes: notes
      });
      
      alert({text:'Notes saved successfully', mode:"success"})
    } catch (error) {
      console.error('Error saving notes:', error);
      alert({text:'Failed to save notes', mode:"error"})

    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Flex style={{ width: "100%", flexDirection: 'column', marginBottom: '60px' }} vertical>
      <NotesRichTextEditor
        value={notes}
        onChange={setNotes}
        placeholder="Add your notes here..."
      />
      <Flex style={{ width: "100%", flexDirection: 'row', marginTop: 16 }} justify="flex-end">
        <Button
          type="primary"
          onClick={handleSaveNotes}
          loading={isSaving}
          style={{
            width: 150,
            background: "linear-gradient(135deg, #0b57d0, #1e88e5)",
            border: "none",
            borderRadius: '6px'
          }}
        >
          Save Notes
        </Button>
      </Flex>
    </Flex>
  );
};

export default Notes;