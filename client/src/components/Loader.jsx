import React from 'react'
import { ThreeDots } from 'react-loader-spinner'
import { Audio } from 'react-loader-spinner'
const Loader = () => {
    return (
        <div>
        <ThreeDots
        height="100"
        width="100"
        radius="9"
        color="#00A63E"
        ariaLabel="three-dots-loading"
        wrapperStyle={{ margin: '20px' }}
        wrapperClass="custom-loader"
        visible={true}
        /></div>

    )
}

export default Loader
