// crossroads-frontend/src/components/RichTextEditor.tsx
import React, { useRef, useEffect, useState, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../assets/styles/quillStyles.css';
import { PlaceholderModule } from '../utils/quillPlaceholders';
// import { placeholderOptions } from '../utils/quillPlaceholders';
import UploadModal from './UploadModal'; // Import the new modal component

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  onUpload?: (file: File, content?: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start Typing and compose your email here...',
  onUpload
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openUploadModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      
      if (!quill.getModule('placeholder')) {
        PlaceholderModule(quill);
      }
    }
  }, []);

  const modules = useMemo(()=>({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'upload'], 
        ['clean']
      ],
      handlers: {
        upload: openUploadModal 
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }),[]);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet', 'indent',
    'align', 'blockquote', 'code-block',
    'link', 'image'
  ];

   const handleFileUpload = (file: File, content?: string) => {
    //console.log(('Uploading file:', file.name);
    //console.log(('File type:', file.type);
    //console.log(('File size:', file.size, 'bytes');
    
    if (content) {
      //console.log(('File content:', content);

    const htmlContent = convertTextToHtml(content);
    //console.log(('Converted HTML content:', htmlContent);
      
      // You could also insert the content into the editor
      if (onChange && content) {
        onChange(htmlContent);
      }
    }
    
    // Call the parent's upload handler if provided
    if (onUpload) {
      onUpload(file, content);
    }


  };

  const convertTextToHtml = (text: string): string => {
  // Replace newlines with <br> tags and wrap in <p> tags
  const paragraphs = text.split('\n\n'); // Split by double newlines for paragraphs
  if (paragraphs.length > 1) {
    return paragraphs.map(paragraph => {
      if (paragraph.trim() === '') return '<p><br></p>';
      return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
    }).join('');
  }
  
  // For single paragraph, just replace newlines with <br> tags
  return text.replace(/\n/g, '<br>');
};

  return (
    <div className="rich-text-editor-container">
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="light-theme-quill"
        theme="snow"
        style={{}}
      />
      
      {/* Upload Modal */}
      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleFileUpload}
      />
    </div>
  );
};

export default RichTextEditor;