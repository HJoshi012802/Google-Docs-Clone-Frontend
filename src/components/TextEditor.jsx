import  { useCallback,useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import {io} from "socket.io-client"
import { useParams } from 'react-router-dom';

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
    const {id:documentId} = useParams();
    const [socket,setSocket] = useState();
    const [quill,setQuill] = useState();

    useEffect(()=>{
    const sock = io("http://192.168.0.163:6069/");
    setSocket(sock);

    return()=>{
        sock.disconnect();
    }
    },[])

    useEffect(()=>{
        if(socket == null || quill == null) return;

        const quillhandler =(delta,oldDelta,source)=>{
            if (source !== 'user') return;
            socket.emit("send-quill-changes",delta)
        }

        quill.on('text-change',quillhandler);

        return ()=>{
            quill.off('text-change')
        }
    },[socket,quill]);

    useEffect(()=>{
        if(socket == null || quill == null) return;

        const quillhandler =(delta)=>{
           quill.updateContents(delta)
        }

        socket.on("recive-quill-changes",quillhandler)

        return ()=>{
            socket.off("recive-quill-changes",quillhandler)
        }
    },[socket,quill]);


    useEffect(()=>{
        if(socket == null || quill == null) return;

        socket.once("load-document",(document) =>{
              quill.setContents(document)
              quill.enable();
        })

        socket.emit("send-documentId",documentId)

        return ()=>{
           
        }
    },[socket,quill,documentId]);

    useEffect(()=>{
        if(socket == null || quill == null) return;
           
        const interval = setInterval(()=>{
         socket.emit("save-document", quill.getContents())
        },2000)
        return ()=>{
            clearInterval(interval);
        }
    },[socket,quill])


    const quillwrapper = useCallback((wrapper) => {
        if(wrapper == null) return;
        wrapper.innerHTML = '';
        const editor = document.createElement('div');
        wrapper.append(editor);
        const qll =new Quill(editor, {
            modules: {
                toolbar: toolbarOptions
            },
            theme: "snow"
        });
        qll.disable()
        qll.setText("Loading ...")
        setQuill(qll)
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