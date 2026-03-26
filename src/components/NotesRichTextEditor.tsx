import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../assets/styles/notesQuillStyles.css';

interface NotesRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const NotesRichTextEditor: React.FC<NotesRichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Add your notes here...'
}) => {
  // Simplified toolbar for notes
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link'
  ];

  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder={placeholder}
      className="dark-theme-quill notes-editor"
      theme="snow"
    />
  );
};

export default NotesRichTextEditor;