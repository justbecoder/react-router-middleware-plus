/**
 * @file: description
 * @author: huxiaoshuai
 * @Date: 2022-06-08 00:08:26
 * @LastEditors: huxiaoshuai
 * @LastEditTime: 2022-06-08 14:41:52
*/
import { useState, useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'
import logo from './logo.svg'
import './App.css'

function App() {
  return (
    <div className="App">
      <Link to="/">首页</Link>
      <Link to="/admin">后台</Link>
      <hr />
      <Outlet></Outlet>


    </div>
  )
}

export default App
