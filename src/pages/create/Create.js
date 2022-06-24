import { useState, useEffect } from 'react'
import { useCollection } from '../../hooks/hooks/useCollection'
import { useAuthContext } from '../../hooks/hooks/useAuthContext'
import { timestamp } from '../../firebase/config'
import { useFirestore } from '../../hooks/hooks/useFirestore'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'

// styles
import './Create.css'

const categories = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
]

export default function Create() {
  const history = useHistory()
  const { addDocument, response } = useFirestore('projects')
  const { user } = useAuthContext()
  const { documents } = useCollection('users')
  const [users, setUsers] = useState([])

  // form field values
  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [assignedUsers, setAssignedUsers] = useState([])
  const [formError, setFormError] = useState(null)

  // create user values for react-select
  useEffect(() => {
    if(documents) {
      setUsers(documents.map(user => {
        return { value: {...user, id: user.id}, label: user.displayName }
      }))
    }
  }, [documents])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!category) {
      setFormError('Chọn loại dự án.')
      return
    }
    if (assignedUsers.length < 1) {
      setFormError('Bạn phải chỉ định ít nhất một người')
      return
    }

    const assignedUsersList = assignedUsers.map(u => {
      return { 
        displayName: u.value.displayName, 
        photoURL: u.value.photoURL,
        id: u.value.id
      }
    })
    const createdBy = { 
      displayName: user.displayName, 
      photoURL: user.photoURL,
      id: user.uid
    }

    const project = {
      name,
      details,
      assignedUsersList, 
      createdBy,
      category: category.value,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      comments: [],
      closedProject: false
    }

    await addDocument(project)
    if (!response.error) {
      history.push('/')
    }
  }
  return (
    <div className="create-form">
      <h2 className="page-title">Tạo một dự án mới</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Tên project:</span>
          <input
            required 
            type="text" 
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>
        <label>
          <span>Chi tiết project:</span>
          <textarea 
            required
            onChange={(e) => setDetails(e.target.value)}
            value={details} 
          ></textarea>
        </label>
        <label>
          <span>Thiết lập ngày đến hạn:</span>
          <input
            required 
            type="date" 
            onChange={(e) => setDueDate(e.target.value)} 
            value={dueDate}
          />
        </label>
        <label>
          <span>Loại project:</span>
          <Select
            onChange={(option) => setCategory(option)}
            options={categories}
          />
        </label>
        <label>
          <span>Chỉ định đến:</span>
          <Select
            onChange={(option) => setAssignedUsers(option)}
            options={users}
            isMulti
          />
        </label>
        <button className="btn">Tạo mới</button>
        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  )
}