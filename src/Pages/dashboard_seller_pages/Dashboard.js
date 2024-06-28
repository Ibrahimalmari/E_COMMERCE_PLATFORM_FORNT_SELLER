import React from 'react'
import "../../App.css";
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        setLoading(false);
  }, [])

    return ( 
        <div> Dashboard </div>
    )
}