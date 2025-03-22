import Link from 'next/link';
import React from 'react'
import { MdChromeReaderMode } from "react-icons/md";
import { GiClick } from "react-icons/gi";
import { TbHandClick } from "react-icons/tb";

const UserGuideLink = () => {
  return (
    
      <Link className='text-blue-600 flex  items-center gap-1 ' href={'/guide'}><TbHandClick/> User guide.</Link>
  )
}

export default UserGuideLink
