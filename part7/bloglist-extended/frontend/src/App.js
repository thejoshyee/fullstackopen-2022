import React from 'react'
import { useState, useEffect, useRef } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useMatch
} from "react-router-dom"

import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

import BlogList from './components/BlogList'
import UserList from './components/UserList'
import Home from './components/Home'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Toggable'
import LoggedIn from './components/LoggedIn'
import User from './components/User'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [allUsers, setAllUsers] = useState([])
  const blogFormRef = useRef()
  const byLikes = (b1, b2) => b2.likes>b1.likes ? 1 : -1

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort(byLikes) )
    )
  }, [])

  useEffect(() => {
    userService.getAll().then(users =>
      setAllUsers(users)
    )
  }, [])

  useEffect(() => {
    const userFromStorage = userService.getUser()
    if (userFromStorage) {
      setUser(userFromStorage)
    }
  }, [])

  const login = async (username, password) => {
    loginService.login({
      username, password,
    }).then(user => {
      setUser(user)
      userService.setUser(user)
      notify(`${user.name} logged in!`)
    }).catch(() => {
      notify('wrong username/password', 'alert')
    })
  }

  const logout = () => {
    setUser(null)
    userService.clearUser()
    notify('good bye!')
  }

  const notify = (message, type='info') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const padding = {
    padding: 5
  }

  if (user === null) {
    return <>
      <Notification notification={notification} />
      <LoginForm onLogin={login} />
    </>
  }

  return (
    <div>
      <Router>
        <div>
          <Link style={padding} to="/">Home</Link>
          <Link style={padding} to="/users">Users</Link>
          <Link style={padding} to="/blogs">Blogs</Link>
        </div>

        <LoggedIn user={user} logout={logout} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<UserList users={allUsers}/>} />
          <Route path="/blogs" element={<BlogList blogs={blogs} user={user}/>} />
          <Route path="/blogs/:id" element={<Blog blogs={blogs} user={user} blogFormRef={blogFormRef} setBlogs={setBlogs} setNotification={setNotification} />} />
          <Route path="/users/:id" element={<User allUsers={allUsers} />} />        
        </Routes>
      </Router>
      <div>
        <i>Bloglist App 2022</i>
      </div>
    </div>
  );
}

export default App;
