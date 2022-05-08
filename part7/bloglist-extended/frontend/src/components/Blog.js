import { useParams, useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'
import { nanoid } from 'nanoid'
import CommentForm from './CommentForm'
import React from 'react'
import { Button } from '@mui/material'

const Blog = (props) => {

  const id = useParams().id
  const blog = props.blogs.find((blog) => blog.id === id)
  const navigate = useNavigate()

  if (!blog) {
    return null
}

  const handleDelete = async (post) => {
    try {
      window.confirm(`Do you really want to delete ${post.title}?`)
      await blogService.remove(post.id)
      props.notify(post.title + ' has been deleted')
      const remainingBlogs = props.blogs.filter(item => item.id !== post.id)
      props.setBlogs(remainingBlogs)
      navigate('/blogs')
    } catch (e) {
      console.log(e)
    }
  }

  const handleLike = async (blog) => {
    try {
      blog.likes += 1
      const likedBlog = await blogService.update(blog.id, blog)
      props.setBlogs(props.blogs.map(blog =>
        blog.id === likedBlog.id ?
          { ...blog, likes: likedBlog.likes }
          : blog
      ))
    } catch (e) {
      console.log(e)
    }
  }

  const createComment = async (id, blog) => {
    try {
      const updatedBlog = await blogService.comment(id, blog);
      props.notify(`Comment Added!`)
      props.setBlogs(
        props.blogs.map(blog => (blog.id === updatedBlog.id ? 
        { ...blog, comments: updatedBlog.comments } 
        : blog
        ))
      )
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div id='blogWrapper'>
      <h3 id='blogTitle'>
        {blog.title} by {blog.author}
      </h3>

        <a href={blog.url}>{blog.url}</a>
        <div>
          <p id='likesCount'>Likes: {blog.likes}</p>
          <Button  variant="contained" color="primary" id='likeButton' onClick={() => handleLike(blog)}>
                Like
          </Button>
          <div>Added by {blog.user.name} ({blog.user.username})</div>
        </div>

        {blog.user.username === props.user.username ?  (
          <Button
            variant="contained" 
            color="primary"
            id='deleteButton'
            onClick={() => handleDelete(blog)}
          >
                Delete
          </Button>
        ) : (
          ''
        )}

        <h3>Comments</h3>
        <ul>
        {blog.comments.map(comment => {
          return <li key={nanoid()}>{comment}</li>
        })}
        </ul>
        <CommentForm 
          createComment={createComment} 
          blogs={props.blogs} 
          setBlogs={props.setBlogs} 
        />

    </div>
  )
}



export default Blog