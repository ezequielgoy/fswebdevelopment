import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../styles/main.css';

function Backbtn() {
const navigate = useNavigate();
function handleBack(){
    navigate('/')
}

  return (
    <div>
      <button className="backbtn" onClick={handleBack}>Volver</button>
    </div>
    
  )
}

export default Backbtn
