import  { useCallback } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
  ];

export default function TextEditor() {
    const quillwrapper = useCallback((wrapper) => {
        if(wrapper == null) return;
        wrapper.innerHTML = '';
        const editor = document.createElement('div');
        wrapper.append(editor);
        new Quill(editor, {
            modules: {
                toolbar: toolbarOptions
            },
            theme: "snow"
        });
    },[]);

    return (
        <div className="container mx-auto px-4 py-8 w-full max-w-4xl">
            <div 
                ref={quillwrapper} 
                className="w-full rounded-lg shadow-md"
            ></div>
        </div>
    );
}