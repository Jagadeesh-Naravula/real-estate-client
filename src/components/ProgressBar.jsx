import React from 'react'

const ProgressBar = ({ width }) => {
  return (
    <div className='w-[50vw] h-[30px] bg-[#cdcdcd] text-[red] relative z-[-1] rounded-[40px] border-none'>
        {width >=0 && width <=100 ? (
            <div className='h-7 grid place-items-center shadow-[0_3px_3px_-5px_#f2709c,0_2px_5px_#f2709c] text-[white] absolute transition-[1.5s] duration-[ease] delay-[0.3s] z-[100] m-auto rounded-[20px] border-none bg-gradient-to-l from-[#f2709c] to-[#ff9472]' style={{ width: `${width}%`}}>
                {width}%
            </div>
        ): (
            ""
        )}
    </div>
  )
}

export default ProgressBar