import { useNavigate, useParams } from "react-router-dom";
import blogsServices from "../services/blogs";
import { useEffect, useState } from "react";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog,setBlog] = useState([])
  const [editing,setEditing] = useState(false)
  const [editedText,setEditedText] = useState('')
    const initiateBlogs = () => {
      blogsServices
                    .getOne(id)
                    .then(response => {
                      setBlog(response.data)
                      console.log(response)
                    })
    }

    useEffect(initiateBlogs,[id])
  const history=useNavigate();

  const handleClick=()=>{
    blogsServices
    .deleteBlog(id)
    .then(()=> {
      history('/',{replace:false});
    })
  }

  const saveEditedBlog = async (id) => {
    const updatedBlog = {...blog, body:editedText}
    console.log("updated Blog",updatedBlog)
    try {
      const savedBlog = await blogsServices.editBlog(id, updatedBlog);
      setBlog(savedBlog);
      setEditing(false)
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  }

  if (editing) {
    return (
      <div className="blog-details">
        <label htmlFor="text">New body</label>
        <input
          type="text"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          style={{paddingLeft:"5px"}}
        />
        <div className="blog-actions" style={{display:"flex",gap:"10px"}}>
          <button onClick={() => saveEditedBlog(blog._id)}>Save</button>
          <button onClick={() => {setEditedText('')
            setEditing(false)
          }}>Cancel</button>
        </div>
      </div>
    )
  } else {
    return (
      <div className="blog-details">
        <article>
          <h2>{ blog.title }</h2>
          <p>Written by { blog.author }</p>
          <div>{ blog.body }</div>
          <div className="buttons" style={{display:"flex",gap:"10px"}}>
            <button onClick={handleClick}>Delete</button>
            <button onClick={() => setEditing(true)}>Edit</button>
          </div>
        </article>
      </div>
    );
  }
}
export default BlogDetails;