/**
 * @file: description
 * @author: huxiaoshuai
 * @Date: 2022-06-08 00:08:26
 * @LastEditors: huxiaoshuai
 * @LastEditTime: 2022-06-08 14:39:02
*/
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Router from './router'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <BrowserRouter>
      <Router></Router>
    </BrowserRouter>
  </>
)
