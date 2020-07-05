import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import './Dropzone.css';
import { FiUpload } from 'react-icons/fi';

interface Props{
    onFileUploaded: (file: File) => void;
}


const Dropzone : React.FC<Props> = (props) => {

    const [selectedFileUrl, setSelectedFileUrl] = useState('');
    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];

        const fileUrl = URL.createObjectURL(file);

        setSelectedFileUrl(fileUrl);
        props.onFileUploaded(file);
    }, []);
    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        accept: 'image/*'
    });

    return (
        <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} accept="image/*" />
        {
            selectedFileUrl
                ? <img src={selectedFileUrl} alt="Point thumbnail" />
                : (<p>
                    <FiUpload></FiUpload>
                    Imagem do estabelecimento.
                </p>)
        }
        
        </div>
    )
}

export default Dropzone;