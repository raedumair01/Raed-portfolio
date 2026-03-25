import "./CircleAvatar.scss"
import React, {useEffect, useState} from 'react'
import ImageView from "/src/components/generic/ImageView.jsx"
import FaIcon from "/src/components/generic/FaIcon.jsx"

function CircleAvatar({img, alt, size, dynamicSize, fallbackIcon, fallbackIconColors, className, imageFit = 'auto'}) {
    const [isWideLogo, setIsWideLogo] = useState(false)
    const sizeClass = `circle-avatar-${size || 1}`
    const dynamicSizeClass = dynamicSize ? `circle-avatar-dynamic-${size}` : ``
    const containModeClass = imageFit === 'contain' ? 'circle-avatar-contain-mode' : ''
    const imageFitClass = imageFit === 'cover'
        ? 'image-view-force-cover'
        : imageFit === 'contain'
            ? 'image-view-force-contain'
            : isWideLogo
                ? 'image-view-wide-logo'
                : ''

    useEffect(() => {
        if(!img || imageFit !== 'auto') {
            setIsWideLogo(false)
            return
        }

        const image = new window.Image()
        image.onload = () => {
            const aspectRatio = image.naturalWidth / image.naturalHeight
            setIsWideLogo(aspectRatio >= 1.15)
        }
        image.onerror = () => {
            setIsWideLogo(false)
        }
        image.src = img
    }, [img])

    return (
        <div className={`circle-avatar ${className} ${sizeClass} ${dynamicSizeClass} ${containModeClass}`}
             style={{
                 backgroundColor: fallbackIconColors && imageFit !== 'contain' ? fallbackIconColors.bg : null,
                 '--circle-avatar-accent': fallbackIconColors ? fallbackIconColors.bg : null,
                 color: fallbackIconColors ? fallbackIconColors.fill : 'inherit'
             }}>
                {img && (<ImageView src={img} alt={alt} className={imageFitClass}/>)}
                {!img && fallbackIcon && (<FaIcon iconName={fallbackIcon}/>)}
        </div>
    )
}

export default CircleAvatar
