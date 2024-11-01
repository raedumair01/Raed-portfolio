import "./ImageView.scss"
import React, {useState} from 'react'

const LoadStatus = {
    LOADING: "loading",
    LOADED: "loaded",
    ERROR: "error"
}

function ImageView({className, src, alt}) {
    const [loadStatus, setLoadStatus] = useState(LoadStatus.LOADING)

    const _onImageLoaded = () => {
        _setLoadStatus(LoadStatus.LOADED)
    }

    const _onImageError = () => {
        _setLoadStatus(LoadStatus.ERROR)
    }

    const _setLoadStatus = (status) => {
        if(status === loadStatus)
            return

        setLoadStatus(status)
    }

    return (
        <div className={`image-view-wrapper ${className}`}>
        {(!src || loadStatus === LoadStatus.LOADING) && (
          <img
            alt="spinner"
            className="image"
            src="images/pictures/osman.jpg"
          />
        )}
      
        {src && (
          <img
            src={src}
            onLoad={_onImageLoaded}
            onError={_onImageError}
            className={`image ${loadStatus === LoadStatus.LOADING ? 'invisible position-absolute' : ''}`}
            alt={alt}
          />
        )}
      </div>
      
    )
}

export default ImageView