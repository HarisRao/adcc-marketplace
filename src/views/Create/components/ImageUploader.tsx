import React, { useState } from 'react'
import classnames from 'classnames'
import ImgPlaceholder from '../../../images/img-placeholder.png'

interface IProps {
  inputId: string
  uploaderSize?: number
  image?: File
  alt?: string
  onChange?: (file: File) => void
}

const ImageUploader: React.FC<IProps> = ({ inputId, uploaderSize = 4, image, alt, onChange }) => {
  const [currentImage, setImage] = useState<File>(image)

  const fileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    if (event.target.files.length > 0) {
      setImage(event.target.files[0])
      onChange(event.target.files[0])
    }
  }

  return (
    <div className="row mt-4 mb-4">
      <div className={`col-12 col-sm-${uploaderSize}`}>
        <div
          className={classnames('img-upload bg-footer', currentImage ? 'uploaded' : null)}
          onClick={() => document.getElementById(inputId)?.click()}
          onKeyPress={() => document.getElementById(inputId)?.click()}
          role="button"
          tabIndex={-1}
        >
          {currentImage ? (
            <img alt={alt} className="card-img item-img" src={URL.createObjectURL(currentImage)} /> // variant="top"
          ) : (
            <img alt="..." src={ImgPlaceholder} />
          )}
        </div>
        <input type="file" style={{ display: 'none' }} id={inputId} onChange={fileChangeHandler} />
      </div>
      <div className={`col-12 col-sm-${12 - uploaderSize}`} />
    </div>
  )
}

export default ImageUploader